import type { Metadata } from "next";
import { getHtmlLang } from "@/lib/i18n/server";
import "./globals.css";

/** Fonts use system stacks only — avoids next/font/google fetching Google at build time (fails offline / blocked regions). */

export const metadata: Metadata = {
  title: "Bead Pattern Generator | Perler / 拼豆",
  description: "Turn any image into a pixel bead pattern. Bulk kits & wholesale inquiry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={getHtmlLang()}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
