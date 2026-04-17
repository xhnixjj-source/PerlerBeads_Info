import { headers } from "next/headers";
import { HTML_LANG, isSiteLocale, LOCALE_HEADER, type SiteLocale } from "./config";

export function getRequestLocale(): SiteLocale {
  const raw = headers().get(LOCALE_HEADER);
  return isSiteLocale(raw) ? raw : "en";
}

export function getHtmlLang(): string {
  return HTML_LANG[getRequestLocale()];
}
