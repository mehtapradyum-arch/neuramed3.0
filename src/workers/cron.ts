
import { prisma } from "@/lib/prisma";
import { sendWebPush, sendEmail } from "@/lib/notify";

const GRACE = Number(process.env.DEFAULT_GRACE_MINUTES || 20);
const ESCALATION = Number(process.env.DEFAULT_ESCALATION_MINUTES || 40);

async function runTick() {
  const now = new Date();
  // Create pending logs for windows starting now (±1min)
  const meds = await prisma.medication.findMany();
  for (const med of meds) {
    const schedule = (med.schedule as any[]) || [];
    for (const slot of schedule) {
      const [h, m] = String(slot.time).split(":").map(Number);
      const start = new Date(now);
      start.setHours(h, m, 0, 0);
      if (Math.abs(start.getTime() - now.getTime()) < 60_000) {
        await prisma.doseLog.create({
          data: { medId: med.id, userId: med.userId, scheduledAt: start, status: "PENDING", source: "server" },
        });
        await sendWebPush(med.userId, { type: "REMINDER", medName: med.name, time: slot.time });
      }
    }
  }

  // Grace escalation to patient
  const graceAgo = new Date(now.getTime() - GRACE * 60_000);
  const pending = await prisma.doseLog.findMany({
    where: { status: "PENDING", scheduledAt: { lt: graceAgo } },
    include: { med: true, user: true },
  });
  for (const log of pending) {
    await prisma.doseLog.update({ where: { id: log.id }, data: { status: "ESCALATED_PATIENT" } });
    await sendWebPush(log.userId, { type: "ESCALATION_PATIENT", medName: log.med.name });
    await sendEmail(log.user.email, `Please take ${log.med.name}`, `<p>Your dose window is closing.</p>`);
    await prisma.alert.create({ data: { userId: log.userId, medId: log.medId, type: "ESCALATION_PATIENT", status: "SENT" } });
  }

  // Escalation to caregivers
  const escAgo = new Date(now.getTime() - ESCALATION * 60_000);
  const escalated = await prisma.doseLog.findMany({
    where: { status: "ESCALATED_PATIENT", scheduledAt: { lt: escAgo } },
    include: { med: true, user: true },
  });

  for (const log of escalated) {
    const caregivers = await prisma.relationship.findMany({ where: { patientId: log.userId }, include: { caregiver: true } });
    for (const rel of caregivers) {
      await sendEmail(rel.caregiver.email, `Missed dose alert: ${log.med.name}`, `<p>${log.user.name ?? "Patient"} may have missed a dose.</p>`);
    }
    await prisma.doseLog.update({ where: { id: log.id }, data: { status: "ESCALATED_CAREGIVER" } });
    await prisma.alert.create({ data: { userId: log.userId, medId: log.medId, type: "ESCALATION_CAREGIVER", status: "SENT" } });
  }

  // Low stock alerts 2 doses before depletion
  const medsAll = await prisma.medication.findMany({ include: { user: true } });
  for (const med of medsAll) {
    const schedule = (med.schedule as any[]) || [];
    const perDay = schedule.length;
    if (!perDay) continue;
    const remainingDoses = med.pillCount;
    if (remainingDoses <= Number(process.env.DEPLETION_ALERT_DOSES_BEFORE || 2)) {
      await prisma.alert.create({ data: { userId: med.userId, medId: med.id, type: "LOW_STOCK", status: "PENDING" } });
      await sendEmail(med.user.email, `Low stock: ${med.name}`, `<p>Low stock alert for ${med.name}.</p>`);
    }
  }
}

export const config = { runtime: "edge" };

export default async function handler() {
  await runTick();
  return new Response(JSON.stringify({ ok: true }));
}
