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

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

function getSingle(param: string | string[] | undefined): string | undefined {
  if (typeof param === "string") return param;
  if (Array.isArray(param) && param[0]) return param[0];
  return undefined;
}

export default async function PatternsPage({ searchParams }: PageProps) {
  const search = getSingle(searchParams.search)?.toLowerCase().trim() ?? "";
  const tag = getSingle(searchParams.tag)?.toLowerCase().trim() ?? "";

  let patterns = await getPatterns();

  if (search) {
    patterns = patterns.filter((p) => {
      const inTitle = p.title.toLowerCase().includes(search);
      const inDesc = p.description.toLowerCase().includes(search);
      const tags = Array.isArray(p.tags) ? p.tags : [];
      const inTags = tags.some((t) => t.toLowerCase().includes(search));
      return inTitle || inDesc || inTags;
    });
  }

  if (tag) {
    patterns = patterns.filter((p) => {
      const tags = Array.isArray(p.tags) ? p.tags : [];
      return tags.some((t) => t.toLowerCase() === tag);
    });
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Pattern Directory
          </h1>
          <p className="mt-2 text-ink-600">
            {search || tag ? (
              <>
                Filtered results
                {search && ` · search “${search}”`}
                {tag && ` · tag “${tag}”`}
              </>
            ) : (
              "Search-friendly pattern pages with difficulty, size, and color list."
            )}
          </p>
        </div>
        <Link
          href="/tools/image-to-pattern"
          className="inline-flex rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          Try image converter
        </Link>
      </div>

      {patterns.length === 0 ? (
        <p className="rounded-2xl border border-ink-200 bg-ink-50 p-8 text-center text-ink-600">
          No patterns match your filters.{" "}
          <Link href="/patterns" className="font-medium text-accent hover:text-accent-hover">
            Clear filters
          </Link>
        </p>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {patterns.map((pattern) => (
            <PatternCard key={pattern.id} pattern={pattern} />
          ))}
        </section>
      )}
    </main>
  );
}
