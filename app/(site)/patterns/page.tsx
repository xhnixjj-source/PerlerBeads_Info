import type { Metadata } from "next";
import Link from "next/link";
import { formatTpl } from "@/lib/i18n/format";
import { getRequestLocale } from "@/lib/i18n/server";
import { getPatterns } from "@/lib/catalog";
import { PatternCard } from "@/components/PatternCard";
import { getMessages } from "@/messages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const loc = getRequestLocale();
  const m = getMessages(loc);
  return { title: m.meta.patternsTitle, description: m.meta.patternsDesc };
}

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

function getSingle(param: string | string[] | undefined): string | undefined {
  if (typeof param === "string") return param;
  if (Array.isArray(param) && param[0]) return param[0];
  return undefined;
}

export default async function PatternsPage({ searchParams }: PageProps) {
  const t = getMessages(getRequestLocale());
  const search = getSingle(searchParams.search)?.toLowerCase().trim() ?? "";
  const tag = getSingle(searchParams.tag)?.toLowerCase().trim() ?? "";

  let patterns = await getPatterns();

  if (search) {
    patterns = patterns.filter((p) => {
      const inTitle = p.title.toLowerCase().includes(search);
      const inDesc = p.description.toLowerCase().includes(search);
      const tags = Array.isArray(p.tags) ? p.tags : [];
      const inTags = tags.some((tg) => tg.toLowerCase().includes(search));
      return inTitle || inDesc || inTags;
    });
  }

  if (tag) {
    patterns = patterns.filter((p) => {
      const tags = Array.isArray(p.tags) ? p.tags : [];
      return tags.some((tg) => tg.toLowerCase() === tag);
    });
  }

  const filterLine =
    search || tag ? (
      <>
        {t.patternsPage.filtered}
        {search && formatTpl(t.patternsPage.searchBit, { q: search })}
        {tag && formatTpl(t.patternsPage.tagBit, { t: tag })}
      </>
    ) : (
      t.patternsPage.subtitle
    );

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{t.patternsPage.title}</h1>
          <p className="mt-2 text-ink-600">
            {!search && !tag && (
              <span className="mr-2 inline-block rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-medium text-ink-700">
                {patterns.length} {t.patternsPage.inDirectory}
              </span>
            )}
            {filterLine}
          </p>
        </div>
        <Link
          href="/tools/image-to-pattern"
          className="inline-flex rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          {t.patternsPage.tryConverter}
        </Link>
      </div>

      {patterns.length === 0 ? (
        <p className="rounded-2xl border border-ink-200 bg-ink-50 p-8 text-center text-ink-600">
          {search || tag ? (
            <>
              {t.patternsPage.noMatch}{" "}
              <Link href="/patterns" className="font-medium text-accent hover:text-accent-hover">
                {t.patternsPage.clearFilters}
              </Link>
            </>
          ) : (
            t.patternsPage.empty
          )}
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
