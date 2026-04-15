import type { Metadata } from "next";
import Link from "next/link";
import { getPatterns } from "@/lib/catalog";
import { PatternCard } from "@/components/PatternCard";

export const metadata: Metadata = {
  title: "Perler Patterns Directory | PerlerHub",
  description:
    "Browse free bead patterns by difficulty and style. Discover color requirements and get complete kit support.",
};

export const dynamic = "force-dynamic";

export default async function PatternsPage() {
  const patterns = await getPatterns();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Pattern Directory
          </h1>
          <p className="mt-2 text-ink-600">
            Search-friendly pattern pages with difficulty, size, and color list.
          </p>
        </div>
        <Link
          href="/tools/image-to-pattern"
          className="inline-flex rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          Try image converter
        </Link>
      </div>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {patterns.map((pattern) => (
          <PatternCard key={pattern.id} pattern={pattern} />
        ))}
      </section>
    </main>
  );
}
