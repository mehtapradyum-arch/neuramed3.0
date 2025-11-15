import { NextResponse } from "next/server";
import { sendReminders } from "@/lib/notify";  // ✅ fixed import

export async function GET() {
  try {
    console.log("Running reminders cron at", new Date().toISOString());
    await sendReminders();
    return NextResponse.json({ ok: true, job: "reminders" });
  } catch (err) {
    console.error("Reminders job failed:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
