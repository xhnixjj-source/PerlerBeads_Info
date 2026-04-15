"use client";

import Link from "next/link";
import { Generator } from "@/components/Generator";

export function HomeHeroGenerator() {
  return (
    <section className="border-b border-ink-200/80 bg-confetti">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-display font-extrabold tracking-tight text-brand-text sm:text-4xl md:text-[2.25rem] md:leading-tight">
            Image to Bead Pattern Generator
          </h1>
          <p className="mt-3 text-base text-brand-text/80 sm:text-lg">
            Transform photos into pixel art designs — pick a grid, tune colors, and preview your bead
            masterpiece in the browser.
          </p>
        </div>
        <div className="mx-auto mt-8 max-w-4xl">
          <Generator variant="home" />
        </div>
        <p className="mx-auto mt-6 max-w-xl text-center text-sm text-brand-text/70">
          Need the full tool page?{" "}
          <Link
            href="/tools/image-to-pattern"
            className="font-semibold text-brand-secondary underline-offset-2 hover:underline"
          >
            Open dedicated workspace
          </Link>
        </p>
      </div>
    </section>
  );
}
