import { NextResponse } from "next/server";
import { cleanupDatabase } from "@/src/lib/dbCache";

export async function GET() {
  try {
    await cleanupDatabase();
    return NextResponse.json({ ok: true, job: "cleanup" });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
