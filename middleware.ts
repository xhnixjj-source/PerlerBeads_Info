import { getNextAuthSecret } from "@/lib/next-auth-secret";
import { isAdminRole } from "@/lib/admin/permissions";
import { LOCALE_COOKIE, LOCALE_HEADER } from "@/lib/i18n/config";
import { parseLocaleCookie, pickPublicLocale, readCountryFromRequest } from "@/lib/i18n/pick-locale";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function adminSubdomainHosts(): string[] {
  const raw = process.env.ADMIN_HOST?.trim();
  if (raw) {
    return raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
  }
  return [];
}

function isAdminHost(host: string): boolean {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  const explicit = adminSubdomainHosts();
  if (explicit.length > 0) {
    return explicit.some((e) => h === e || h.endsWith(`.${e}`));
  }
  return h.startsWith("admin.");
}

function resolveUiLocale(req: NextRequest, path: string, host: string): string {
  if (isAdminHost(host) || path.startsWith("/admin")) return "zh";
  const cookieRaw = req.cookies.get(LOCALE_COOKIE)?.value;
  return pickPublicLocale({
    cookieValue: cookieRaw,
    country: readCountryFromRequest(req),
    acceptLanguage: req.headers.get("accept-language"),
  });
}

function nextWithLocale(req: NextRequest, locale: string): NextResponse {
  const headers = new Headers(req.headers);
  headers.set(LOCALE_HEADER, locale);
  return NextResponse.next({ request: { headers } });
}

function rewriteWithLocale(req: NextRequest, locale: string, url: URL): NextResponse {
  const headers = new Headers(req.headers);
  headers.set(LOCALE_HEADER, locale);
  return NextResponse.rewrite(url, { request: { headers } });
}

function attachPersistedLocaleCookie(
  req: NextRequest,
  path: string,
  host: string,
  res: NextResponse,
  locale: string,
) {
  if (path.startsWith("/api") || path.startsWith("/admin") || isAdminHost(host)) return;
  if (parseLocaleCookie(req.cookies.get(LOCALE_COOKIE)?.value)) return;
  res.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const path = req.nextUrl.pathname;
  const uiLocale = resolveUiLocale(req, path, host);

  if (isAdminHost(host)) {
    if (path === "/login") {
      return rewriteWithLocale(req, "zh", new URL("/admin/login", req.url));
    }
    if (path === "/" || path === "") {
      return rewriteWithLocale(req, "zh", new URL("/admin/dashboard", req.url));
    }
    if (
      !path.startsWith("/admin") &&
      !path.startsWith("/api") &&
      !path.startsWith("/_next") &&
      path !== "/favicon.ico"
    ) {
      const url = req.nextUrl.clone();
      url.pathname = `/admin${path.startsWith("/") ? path : `/${path}`}`;
      return rewriteWithLocale(req, "zh", url);
    }
  }

  const secret = getNextAuthSecret();
  if (!secret) {
    if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
      return NextResponse.json({ error: { message: "Server misconfigured", code: "no_secret" } }, { status: 503 });
    }
    if (path.startsWith("/api/admin")) {
      return NextResponse.json({ error: { message: "Server misconfigured", code: "no_secret" } }, { status: 503 });
    }
    const res = nextWithLocale(req, uiLocale);
    attachPersistedLocaleCookie(req, path, host, res, uiLocale);
    return res;
  }

  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    const token = await getToken({ req, secret });
    const role = typeof token?.role === "string" ? token.role : "";
    if (!token || !isAdminRole(role)) {
      const login = new URL("/admin/login", req.url);
      login.searchParams.set("callbackUrl", path + (req.nextUrl.search || ""));
      return NextResponse.redirect(login);
    }
  }

  if (path.startsWith("/api/admin")) {
    const token = await getToken({ req, secret });
    const role = typeof token?.role === "string" ? token.role : "";
    if (!token || !isAdminRole(role)) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "unauthorized", status: 401 } },
        { status: 401 },
      );
    }
  }

  const res = nextWithLocale(req, uiLocale);
  attachPersistedLocaleCookie(req, path, host, res, uiLocale);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
