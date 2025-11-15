import { kv } from "@vercel/kv";

type LimitResult = { allowed: boolean; remaining: number; resetAt: number };

export async function rateLimit(key: string, maxPerWindow: number, windowSeconds: number): Promise<LimitResult> {
  const now = Math.floor(Date.now() / 1000);
  const windowKey = `rate:${key}:${Math.floor(now / windowSeconds)}`;
  const count = (await kv.incr(windowKey)) ?? 0;
  if (count === 1) {
    await kv.expire(windowKey, windowSeconds);
  }
  const allowed = count <= maxPerWindow;
  const remaining = Math.max(0, maxPerWindow - count);
  const resetAt = (Math.floor(now / windowSeconds) + 1) * windowSeconds;
  return { allowed, remaining, resetAt };
}
