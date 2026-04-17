"use client";

import { SITE_LOCALES, type SiteLocale } from "@/lib/i18n/config";
import { useRouter } from "next/navigation";
import { useSiteLocale } from "@/components/i18n/SiteLocaleProvider";

const NATIVE_LABELS: Record<SiteLocale, string> = {
  zh: "中文",
  en: "English",
  ja: "日本語",
  ko: "한국어",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
};

export function LanguageSwitcher() {
  const { locale, messages } = useSiteLocale();
  const router = useRouter();

  async function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as SiteLocale;
    if (next === locale) return;
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: next }),
    });
    router.refresh();
  }

  return (
    <label className="flex shrink-0 items-center gap-1.5">
      <span className="hidden text-xs font-medium text-brand-text/60 sm:inline">{messages.nav.language}</span>
      <select
        value={locale}
        onChange={onChange}
        aria-label={messages.nav.language}
        className="max-w-[7.5rem] rounded-lg border border-ink-200/90 bg-white px-2 py-1.5 text-xs font-semibold text-brand-text shadow-sm outline-none focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20"
      >
        {SITE_LOCALES.map((code) => (
          <option key={code} value={code}>
            {NATIVE_LABELS[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
