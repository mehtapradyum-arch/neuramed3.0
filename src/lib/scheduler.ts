// src/lib/scheduler.ts
import { prisma } from "@/lib/prisma";

/**
 * Escalate missed doses to caregivers.
 */
export async function escalateMissedDoses(): Promise<void> {
  const missed = await prisma.schedule.findMany({
    where: {
      completed: false,
      dueAt: { lte: new Date(Date.now() - 60 * 60 * 1000) } // overdue by 1h
    },
    include: { user: { include: { caregivers: true } } }
  });

  for (const dose of missed) {
    for (const caregiver of dose.user.caregivers) {
      console.log(`Escalation: notify caregiver ${caregiver.email} about missed dose for ${dose.user.email}`);
      // TODO: integrate with notify/send API route
    }
  }
}
