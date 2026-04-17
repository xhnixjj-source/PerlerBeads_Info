/**
 * Single source for JWT signing / verification (NextAuth + middleware `getToken`).
 * Production must set NEXTAUTH_SECRET. In development, a fixed fallback avoids
 * "no_secret" when .env.local is missing the variable (still set it for consistency).
 */
export function getNextAuthSecret(): string | undefined {
  const raw = process.env.NEXTAUTH_SECRET?.trim();
  if (raw) return raw;
  if (process.env.NODE_ENV === "development") {
    return "dev-only-perlerhub-nextauth-do-not-use-in-production";
  }
  return undefined;
}
