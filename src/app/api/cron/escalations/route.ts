import { NextResponse } from "next/server";
import { escalateMissedDoses } from "@/lib/scheduler";

export async function GET() {
  try {
    console.log("Running escalations cron at", new Date().toISOString());
    await escalateMissedDoses();
    return NextResponse.json({ ok: true, job: "escalations" });
  } catch (err) {
    console.error("Escalations job failed:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
