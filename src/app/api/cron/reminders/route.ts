import { NextResponse } from "next/server";
import { sendReminders } from "@/src/lib/notify";

export async function GET() {
  try {
    await sendReminders();
    return NextResponse.json({ ok: true, job: "reminders" });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
