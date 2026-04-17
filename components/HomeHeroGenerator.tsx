"use client";

import { useSiteLocale } from "@/components/i18n/SiteLocaleProvider";
import Link from "next/link";

export function HomeHeroGenerator() {
  const { messages: m } = useSiteLocale();
  return (
    <section className="border-b border-ink-200/80 bg-confetti">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-display font-extrabold tracking-tight text-brand-text sm:text-4xl md:text-[2.25rem] md:leading-tight">
            {m.hero.title}
          </h1>
          <p className="mt-3 text-base text-brand-text/80 sm:text-lg">{m.hero.subtitle}</p>
        </div>
        <div className="mx-auto mt-8 max-w-lg rounded-3xl border border-ink-200/90 bg-white/95 p-8 text-center shadow-xl backdrop-blur-sm">
          <p className="text-sm text-brand-text/75">{m.hero.card}</p>
          <Link
            href="/tools/image-to-pattern"
            className="mt-6 inline-flex rounded-full bg-gradient-to-r from-brand-primary to-brand-coral px-8 py-3.5 text-sm font-bold text-white shadow-md transition hover:brightness-105"
          >
            {m.hero.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
