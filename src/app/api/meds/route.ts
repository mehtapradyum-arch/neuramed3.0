
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { requireVerified } from "@/lib/validate";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await rateLimit(`meds:${session.user?.email}`);
  const user = await prisma.user.findUnique({ where: { email: session.user!.email! } });
  const meds = await prisma.medication.findMany({ where: { userId: user!.id } });
  return NextResponse.json({ meds });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await rateLimit(`meds:${session.user?.email}`);
  try { requireVerified(session); } catch (e: any) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }

  const body = await req.json();
  const user = await prisma.user.findUnique({ where: { email: session.user!.email! } });
  const med = await prisma.medication.create({
    data: {
      userId: user!.id,
      name: body.name,
      dosage: body.dosage,
      schedule: body.schedule,
      pillCount: body.pillCount ?? 0,
      refillThreshold: body.refillThreshold ?? 10,
      notes: body.notes,
      critical: !!body.critical,
      images: body.images ?? [],
    },
  });
  return NextResponse.json({ med });
}
