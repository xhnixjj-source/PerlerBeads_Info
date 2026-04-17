import type { SiteLocale } from "@/lib/i18n/config";
import { isSiteLocale } from "@/lib/i18n/config";
import { de } from "./de";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { ja } from "./ja";
import { ko } from "./ko";
import type { Messages } from "./types";
import { zh } from "./zh";

const catalog: Record<SiteLocale, Messages> = {
  zh,
  en,
  ja,
  ko,
  fr,
  de,
  es,
};

export function getMessages(locale: string): Messages {
  return isSiteLocale(locale) ? catalog[locale] : en;
}

export type { Messages };
