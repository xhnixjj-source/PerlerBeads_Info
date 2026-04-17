/**
 * Deterministic “dynamic-looking” stats for UI demos (not real analytics).
 * Values are stable for a given slug/id so SSR and hydration stay consistent.
 */

function stableHash(seed: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

/** Simulated profile views in the last 7 days. */
export function demoWeeklyViews(slugOrId: string): number {
  return (stableHash(`wviews:${slugOrId}`) % 12_000) + 180;
}

/** Simulated “saved to kit list” count. */
export function demoSaveCount(slugOrId: string): number {
  return (stableHash(`saves:${slugOrId}`) % 420) + 8;
}

/** Simulated B2B inquiries in the last 30 days (suppliers). */
export function demoSupplierInquiries30d(slugOrId: string): number {
  return (stableHash(`inq30:${slugOrId}`) % 52) + 2;
}

/** Typical response window in hours (demo). */
export function demoSupplierResponseHours(slugOrId: string): number {
  return (stableHash(`resp:${slugOrId}`) % 28) + 6;
}

/** Small integer for “also viewing” style hints. */
export function demoConcurrentHint(slugOrId: string): number {
  return (stableHash(`live:${slugOrId}`) % 9) + 2;
}

/** Site-wide pulse number that changes by UTC hour (still not real traffic). */
export function demoRollingVisitorsUtcHour(): number {
  const hour = new Date().getUTCHours();
  const base = stableHash(`pulse:${hour}`) % 80;
  return base + 140;
}

export function formatDemoCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${Math.round(n / 1000)}K`;
  if (n >= 1_000) {
    const k = n / 1000;
    return k % 1 < 0.05 ? `${Math.round(k)}K` : `${k.toFixed(1)}K`;
  }
  return String(n);
}
