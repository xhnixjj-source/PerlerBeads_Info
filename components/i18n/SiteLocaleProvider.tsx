"use client";

import type { SiteLocale } from "@/lib/i18n/config";
import type { Messages } from "@/messages";
import { createContext, useContext } from "react";

export type SiteLocaleContextValue = {
  locale: SiteLocale;
  messages: Messages;
};

const SiteLocaleContext = createContext<SiteLocaleContextValue | null>(null);

export function SiteLocaleProvider({
  locale,
  messages,
  children,
}: Readonly<{
  locale: SiteLocale;
  messages: Messages;
  children: React.ReactNode;
}>) {
  return <SiteLocaleContext.Provider value={{ locale, messages }}>{children}</SiteLocaleContext.Provider>;
}

export function useSiteLocale(): SiteLocaleContextValue {
  const v = useContext(SiteLocaleContext);
  if (!v) {
    throw new Error("useSiteLocale must be used within SiteLocaleProvider");
  }
  return v;
}
