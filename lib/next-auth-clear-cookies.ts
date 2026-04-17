import type { NextResponse } from "next/server";

/**
 * Expires NextAuth session cookies so a new NEXTAUTH_SECRET can take effect.
 * Must mirror cookie options in `lib/auth.ts` (path, domain, secure).
 */
export function clearNextAuthSessionCookies(res: NextResponse): void {
  const isProd = process.env.NODE_ENV === "production";
  const domain = process.env.AUTH_COOKIE_DOMAIN?.trim() || undefined;
  const secure = isProd;

  const names = isProd
    ? ["__Secure-next-auth.session-token", "next-auth.session-token"]
    : ["next-auth.session-token", "__Secure-next-auth.session-token"];

  for (const name of names) {
    res.cookies.set(name, "", {
      path: "/",
      maxAge: 0,
      httpOnly: true,
      sameSite: "lax",
      secure,
      domain,
    });
  }
}
