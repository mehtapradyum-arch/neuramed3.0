import { prisma } from "../src/lib/prisma";

async function run() {
  const maria = await prisma.user.upsert({
    where: { email: "maria@example.com" },
    update: {},
    create: { email: "maria@example.com", name: "Maria Rodriguez", role: "PATIENT", emailVerified: new Date() },
  });
  const sofia = await prisma.user.upsert({
    where: { email: "sofia@example.com" },
    update: {},
    create: { email: "sofia@example.com", name: "Sofia Rodriguez", role: "CAREGIVER", emailVerified: new Date() },
  });
  await prisma.relationship.upsert({
    where: { id: "rel1" },
    update: {},
    create: { id: "rel1", patientId: maria.id, caregiverId: sofia.id, permissions: "read,ack" },
  });

  const meds = [
    { name: "Atorvastatin", dosage: "20 mg", times: ["08:00"] },
    { name: "Metformin", dosage: "500 mg", times: ["08:00", "20:00"] },
    { name: "Lisinopril", dosage: "10 mg", times: ["09:00"] },
    { name: "Aspirin", dosage: "81 mg", times: ["12:00"] },
    { name: "Vitamin D", dosage: "1000 IU", times: ["10:00"] },
  ];

  for (const [i, m] of meds.entries()) {
    await prisma.medication.upsert({
      where: { id: `med${i}` },
      update: {},
      create: {
        id: `med${i}`,
        userId: maria.id,
        name: m.name,
        dosage: m.dosage,
        schedule: m.times.map((t) => ({ time: t, windowMinutes: 60 })),
        pillCount: 10 + i * 5,
        refillThreshold: 5,
        critical: i % 2 === 0,
      },
    });
  }

  // Simulated missed doses
  const now = new Date();
  const past = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  const med0 = await prisma.medication.findFirst({ where: { userId: maria.id, name: "Metformin" } });
  if (med0) {
    await prisma.doseLog.create({
      data: { medId: med0.id, userId: maria.id, scheduledAt: past, status: "PENDING", source: "seed" },
    });
  }

  console.log("Seeded demo data for Maria & Sofia");
}

run().finally(() => prisma.$disconnect());
