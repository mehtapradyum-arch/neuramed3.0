// src/lib/forecast.ts
import { prisma } from "@/lib/prisma";

/**
 * Generate adherence forecasts based on patient history.
 */
export async function generateForecasts(): Promise<void> {
  const patients = await prisma.user.findMany();

  for (const patient of patients) {
    // Example: count missed doses in last 7 days
    const missed = await prisma.schedule.count({
      where: {
        userId: patient.id,
        completed: false,
        dueAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }
    });

    console.log(`Forecast for ${patient.email}: missed ${missed} doses last week`);
    // TODO: store forecast results in DB or send to caregiver dashboard
  }
}
