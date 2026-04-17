import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteSessionProvider } from "@/components/SiteSessionProvider";
import { SiteLocaleProvider } from "@/components/i18n/SiteLocaleProvider";
import { getRequestLocale } from "@/lib/i18n/server";
import { getMessages } from "@/messages";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = getRequestLocale();
  const messages = getMessages(locale);
  return (
    <SiteLocaleProvider locale={locale} messages={messages}>
      <SiteSessionProvider>
        <SiteHeader messages={messages} />
        {children}
        <SiteFooter messages={messages} />
      </SiteSessionProvider>
    </SiteLocaleProvider>
  );
}
