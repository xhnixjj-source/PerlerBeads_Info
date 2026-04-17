import type { SiteLocale } from "./config";
import { isSiteLocale } from "./config";

/** ISO 3166-1 alpha-2 → primary site language (best-effort). */
const COUNTRY_TO_LOCALE: Record<string, SiteLocale> = {
  CN: "zh",
  TW: "zh",
  HK: "zh",
  MO: "zh",
  SG: "en",
  JP: "ja",
  KR: "ko",
  DE: "de",
  AT: "de",
  FR: "fr",
  LU: "fr",
  MC: "fr",
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  CL: "es",
  PE: "es",
  US: "en",
  GB: "en",
  CA: "en",
  AU: "en",
  NZ: "en",
  IE: "en",
  IN: "en",
  ZA: "en",
  NL: "en",
  SE: "en",
  NO: "en",
  DK: "en",
  FI: "en",
  IT: "en",
  PT: "en",
  BE: "fr",
  CH: "de",
};

function localeFromAcceptLanguage(header: string | null | undefined): SiteLocale | null {
  if (!header) return null;
  const parts = header.split(",").map((p) => p.trim().split(";")[0]?.toLowerCase() ?? "");
  for (const raw of parts) {
    const base = raw.split("-")[0] ?? raw;
    if (base === "zh" || base === "cn") return "zh";
    if (base === "ja") return "ja";
    if (base === "ko") return "ko";
    if (base === "fr") return "fr";
    if (base === "de") return "de";
    if (base === "es") return "es";
    if (base === "en") return "en";
  }
  return null;
}

export function countryToLocale(country: string | undefined | null): SiteLocale | null {
  if (!country) return null;
  const c = country.trim().toUpperCase();
  return COUNTRY_TO_LOCALE[c] ?? null;
}

export function pickPublicLocale(args: {
  cookieValue: string | null | undefined;
  country: string | null | undefined;
  acceptLanguage: string | null | undefined;
}): SiteLocale {
  if (isSiteLocale(args.cookieValue)) return args.cookieValue;
  const fromGeo = countryToLocale(args.country);
  if (fromGeo) return fromGeo;
  const fromAl = localeFromAcceptLanguage(args.acceptLanguage);
  if (fromAl) return fromAl;
  return "en";
}

export function readCountryFromRequest(req: {
  headers: Headers;
  geo?: { country?: string };
}): string | undefined {
  const h = req.headers.get("x-vercel-ip-country");
  if (h && h.length === 2) return h;
  const g = req.geo?.country;
  if (g && g.length === 2) return g;
  return undefined;
}

export function parseLocaleCookie(raw: string | null | undefined): SiteLocale | null {
  if (!raw) return null;
  const v = raw.trim().toLowerCase();
  return isSiteLocale(v) ? v : null;
}
