import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

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
    <html lang="en">
      <body className="font-sans antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
