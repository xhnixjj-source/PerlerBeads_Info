const buckets = new Map<string, { count: number; startAt: number }>();

/**
 * Simple in-memory sliding window per logical key (e.g. adminId + route).
 * Resets when the window elapses. Fine for single-node dev/small deploys.
 */
export function checkAdminAiRateLimit(key: string, windowMs: number, max: number): boolean {
  const now = Date.now();
  const cur = buckets.get(key);
  if (!cur || now - cur.startAt > windowMs) {
    buckets.set(key, { count: 1, startAt: now });
    return true;
  }
  if (cur.count >= max) return false;
  cur.count += 1;
  return true;
}
