import { isSiteLocale, LOCALE_COOKIE, type SiteLocale } from "@/lib/i18n/config";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = { locale?: string };

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const loc = typeof body.locale === "string" ? body.locale.trim().toLowerCase() : "";
  if (!isSiteLocale(loc)) {
    return NextResponse.json({ ok: false, error: "invalid_locale" }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true, locale: loc as SiteLocale });
  res.cookies.set(LOCALE_COOKIE, loc, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return res;
}
