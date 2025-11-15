
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await rateLimit(`me:${session.user?.email}`);
  const user = await prisma.user.findUnique({ where: { email: session.user!.email! } });
  return NextResponse.json({ user });
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await rateLimit(`me:${session.user?.email}`);
  const body = await req.json();
  const user = await prisma.user.update({ where: { email: session.user!.email! }, data: { name: body.name } });
  return NextResponse.json({ user });
}
