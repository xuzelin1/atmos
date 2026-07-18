import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; messageId: string } }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const message = await prisma.agentMessage.findUnique({
    where: { id: params.messageId },
    include: { project: true },
  });

  if (!message || message.project.userId !== user.id) {
    return NextResponse.json({ error: "消息不存在" }, { status: 404 });
  }

  await prisma.agentMessage.delete({ where: { id: params.messageId } });

  // 重置项目状态
  await prisma.project.update({
    where: { id: params.id },
    data: { status: "researching" },
  });

  return NextResponse.json({ success: true });
}