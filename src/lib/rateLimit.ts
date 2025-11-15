import { kv } from "@vercel/kv"; // Optional; fallback to in-memory
const mem = new Map<string, { count: number; ts: number }>();

export async function rateLimit(key: string, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  try {
    const k = `rl:${key}:${Math.floor(now / windowMs)}`;
    const val = (await kv.incr(k)) ?? 1;
    if (val === 1) await kv.expire(k, Math.ceil(windowMs / 1000));
    if (val > limit) throw new Error("Rate limit");
  } catch {
    const bucket = mem.get(key);
    if (!bucket || now - bucket.ts > windowMs) mem.set(key, { count: 1, ts: now });
    else {
      bucket.count += 1;
      if (bucket.count > limit) throw new Error("Rate limit");
    }
  }
}
