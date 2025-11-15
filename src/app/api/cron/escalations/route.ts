import { NextResponse } from "next/server";
import { escalateMissedDoses } from "@/src/lib/scheduler";

export async function GET() {
  try {
    await escalateMissedDoses();
    return NextResponse.json({ ok: true, job: "escalations" });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
