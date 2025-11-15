import { NextResponse } from "next/server";
import { generateForecasts } from "@/src/lib/forecast";

export async function GET() {
  try {
    await generateForecasts();
    return NextResponse.json({ ok: true, job: "forecasts" });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
