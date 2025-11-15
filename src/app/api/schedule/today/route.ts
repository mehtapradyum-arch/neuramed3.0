// src/app/api/schedule/today/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user!.email! } });
  const start = new Date(); start.setHours(0,0,0,0);
  const end = new Date(); end.setHours(23,59,59,999);
  const logs = await prisma.doseLog.findMany({ where: { userId: user!.id, scheduledAt: { gte: start, lte: end } }, include: { med: true } });
  return NextResponse.json({ logs });
}
