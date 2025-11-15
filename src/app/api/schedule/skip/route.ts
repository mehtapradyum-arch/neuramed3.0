// src/app/api/schedule/skip/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { doseLogId } = await req.json();
  const log = await prisma.doseLog.update({ where: { id: doseLogId }, data: { status: "SKIPPED" } });
  return NextResponse.json({ ok: true, log });
}
