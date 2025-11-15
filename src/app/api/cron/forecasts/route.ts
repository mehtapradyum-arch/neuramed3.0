import { NextResponse } from "next/server";
import { generateForecasts } from "@/lib/forecast";

export async function GET() {
  try {
    console.log("Running forecasts cron at", new Date().toISOString());
    await generateForecasts();
    return NextResponse.json({ ok: true, job: "forecasts" });
  } catch (err) {
    console.error("Forecasts job failed:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
