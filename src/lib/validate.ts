import { NextRequest } from "next/server";

export function requireVerified(session: any) {
  const demo = process.env.DEMO_MODE === "true";
  if (demo) return; // demo bypass
  if (!session?.email || !session?.emailVerified) {
    const err: any = new Error("Email verification required");
    err.status = 403;
    throw err;
  }
}
