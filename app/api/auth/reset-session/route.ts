import { clearNextAuthSessionCookies } from "@/lib/next-auth-clear-cookies";
import { NextResponse } from "next/server";

/**
 * Clears invalid NextAuth session cookies (e.g. after NEXTAUTH_SECRET changed)
 * and redirects to the admin login page.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const login = new URL("/admin/login", url.origin);
  login.searchParams.set("cleared", "1");
  const res = NextResponse.redirect(login);
  clearNextAuthSessionCookies(res);
  return res;
}
