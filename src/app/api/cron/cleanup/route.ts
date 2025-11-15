import { NextResponse } from "next/server";
import { cleanupDatabase } from "@/lib/dbCache";  // ✅ fixed import

export async function GET() {
  try {
    console.log("Running cleanup cron at", new Date().toISOString());
    await cleanupDatabase();
    return NextResponse.json({ ok: true, job: "cleanup" });
  } catch (err) {
    console.error("Cleanup job failed:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
