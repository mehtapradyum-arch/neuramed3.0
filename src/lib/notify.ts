// src/lib/notify.ts
import { prisma } from "@/lib/prisma";

/**
 * Send reminders to patients about upcoming doses.
 * Replace with actual notification logic (email, push, SMS).
 */
export async function sendReminders(): Promise<void> {
  // Example: find all scheduled doses due in next 15 minutes
  const upcoming = await prisma.schedule.findMany({
    where: {
      dueAt: {
        lte: new Date(Date.now() + 15 * 60 * 1000)
      },
      completed: false
    },
    include: { user: true }
  });

  for (const dose of upcoming) {
    console.log(`Reminder: ${dose.user.email} should take ${dose.medicationId}`);
    // TODO: integrate with your notify/send API route or push/email service
  }
}
