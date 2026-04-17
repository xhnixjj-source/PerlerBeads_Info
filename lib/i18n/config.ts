export const SITE_LOCALES = ["zh", "en", "ja", "ko", "fr", "de", "es"] as const;

export type SiteLocale = (typeof SITE_LOCALES)[number];

export function isSiteLocale(value: string | null | undefined): value is SiteLocale {
  return !!value && (SITE_LOCALES as readonly string[]).includes(value);
}

/** BCP 47 / HTML `lang` */
export const HTML_LANG: Record<SiteLocale, string> = {
  zh: "zh-CN",
  en: "en",
  ja: "ja",
  ko: "ko",
  fr: "fr",
  de: "de",
  es: "es",
};

export const LOCALE_COOKIE = "PB_LOCALE";
export const LOCALE_HEADER = "x-pb-locale";
