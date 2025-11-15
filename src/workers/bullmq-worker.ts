import { Queue, Worker } from "bullmq";
import { prisma } from "@/lib/prisma";
import { sendWebPush, sendEmail } from "@/lib/notify";

const queue = new Queue("neuramed", { connection: { url: process.env.REDIS_URL! } });

new Worker(
  "neuramed",
  async (job) => {
    if (job.name === "escalation") {
      const { doseLogId } = job.data;
      const log = await prisma.doseLog.findUnique({ where: { id: doseLogId }, include: { user: true, med: true } });
      if (log && log.status === "PENDING") {
        await prisma.doseLog.update({ where: { id: log.id }, data: { status: "ESCALATED_PATIENT" } });
        await sendEmail(log.user.email, `Please take ${log.med.name}`, `<p>Your dose window is closing.</p>`);
      }
    }
  },
  { connection: { url: process.env.REDIS_URL! } }
);

console.log("Worker listening...");
