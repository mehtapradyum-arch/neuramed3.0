import { Medication } from "@prisma/client";

export function dosesPerDay(schedule: any[]): number {
  return schedule?.length ? schedule.length : 0;
}

export function forecastDepletion(med: Medication) {
  const perDay = dosesPerDay(med.schedule as any[]);
  if (perDay === 0) return null;
  const days = med.pillCount / perDay;
  const milliseconds = days * 24 * 60 * 60 * 1000;
  const date = new Date(Date.now() + milliseconds);
  return date;
}
