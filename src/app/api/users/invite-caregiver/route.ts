
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/notify";
import { rateLimit } from "@/lib/rateLimit";
import { requireVerified } from "@/lib/validate";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await rateLimit(`invite:${session.user?.email}`);
  try { requireVerified(session); } catch (e: any) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }

  const { caregiverEmail } = await req.json();
  let caregiver = await prisma.user.findUnique({ where: { email: caregiverEmail } });
  if (!caregiver) caregiver = await prisma.user.create({ data: { email: caregiverEmail, role: "CAREGIVER" } });
  const patient = await prisma.user.findUnique({ where: { email: session.user!.email! } });
  await prisma.relationship.create({ data: { patientId: patient!.id, caregiverId: caregiver.id } });
  await sendEmail(caregiverEmail, "NeuraMed caregiver invite", `<p>You've been invited to monitor ${patient?.name ?? "a patient"}.</p>`);
  return NextResponse.json({ ok: true });
}
