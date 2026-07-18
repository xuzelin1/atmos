import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { qwenClient, AGENTS } from "@/lib/agents";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// 流式响应需要更大的内存
export const maxDuration = 60;

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const projectId = params.id;
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { messages: { orderBy: { stepOrder: "asc" } } },
  });

  if (!project || project.userId !== user.id) {
    return NextResponse.json({ error: "项目不存在" }, { status: 404 });
  }

  const { agentIndex } = await req.json();
  const agent = AGENTS[agentIndex];
  if (!agent) {
    return NextResponse.json({ error: "无效的 Agent 索引" }, { status: 400 });
  }

  // 构建上下文：之前 Agent 的输出
  const previousMessages = project.messages
    .filter((m) => m.stepOrder < agent.stepOrder)
    .map((m) => `【${m.agentName}（${m.agentRole}）】:\n${m.content}`)
    .join("\n\n---\n\n");

  const userMessage = `用户产品想法：${project.idea}`;
  const contextPrompt = previousMessages
    ? `以下是之前阶段的分析结果，请基于此继续你的工作：\n\n${previousMessages}\n\n---\n\n现在请基于以上信息，给出你的分析：`
    : `请直接基于用户的想法给出你的分析：`;

  try {
    // 使用流式输出
    const stream = await qwenClient.chat.completions.create({
      model: "qwen3.7-plus",
      messages: [
        { role: "system", content: agent.systemPrompt },
        { role: "user", content: `${userMessage}\n\n${contextPrompt}` },
      ],
      stream: true,
      temperature: 0.7,
    });

    // 收集完整响应
    let fullContent = "";
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
              fullContent += delta;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`)
              );
            }
          }

          // 保存到数据库
          await prisma.agentMessage.create({
            data: {
              projectId,
              agentRole: agent.role,
              agentName: agent.name,
              content: fullContent,
              stepOrder: agent.stepOrder,
            },
          });

          // 更新项目状态
          const nextStatus =
            agentIndex < AGENTS.length - 1
              ? AGENTS[agentIndex + 1].role + "ing"
              : "completed";
          await prisma.project.update({
            where: { id: projectId },
            data: { status: nextStatus },
          });

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ done: true, stepOrder: agent.stepOrder, status: nextStatus })}\n\n`
            )
          );
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "AI 生成失败，请重试" })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Agent run error:", error);
    return NextResponse.json({ error: "AI 调用失败" }, { status: 500 });
  }
}