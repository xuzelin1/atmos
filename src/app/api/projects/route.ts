import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { messages: true } } },
  });

  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const { name, idea } = await req.json();

  if (!name || !idea) {
    return NextResponse.json({ error: "项目名称和想法不能为空" }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      name,
      idea,
      userId: user.id!,
      status: "researching",
    },
  });

  return NextResponse.json({ project });
}