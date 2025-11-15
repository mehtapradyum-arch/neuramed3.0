import webpush from "web-push";
import { prisma } from "./prisma";

webpush.setVapidDetails(process.env.VAPID_SUBJECT!, process.env.VAPID_PUBLIC_KEY!, process.env.VAPID_PRIVATE_KEY!);

export async function sendWebPush(userId: string, payload: any) {
  const tokens = await prisma.deviceToken.findMany({ where: { userId } });
  await Promise.all(
    tokens.map(async (t) => {
      try {
        await webpush.sendNotification(JSON.parse(t.pushToken), JSON.stringify(payload));
      } catch (e) {
        console.error("Push fail", e);
      }
    })
  );
}

export async function sendEmail(to: string, subject: string, html: string) {
  const provider = process.env.EMAIL_PROVIDER || "resend";
  if (provider === "sendgrid") {
    const sg = await import("@sendgrid/mail");
    sg.default.setApiKey(process.env.SENDGRID_API_KEY!);
    await sg.default.send({ to, from: process.env.EMAIL_FROM!, subject, html });
  } else if (provider === "resend") {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY!);
    await resend.emails.send({ to, from: process.env.EMAIL_FROM!, subject, html });
  } else {
    // fallback SMTP via NextAuth provider
  }
}
