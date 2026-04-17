import type { Metadata } from "next";
import Link from "next/link";
import { RemoteCoverImage } from "@/components/RemoteCoverImage";
import { notFound } from "next/navigation";
import { ShareButtons } from "@/components/ShareButtons";
import { getPatternBySlug, getRelatedPatterns } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/absolute-url";
import { PatternCard } from "@/components/PatternCard";
import { BuyKitButton } from "@/components/patterns/BuyKitButton";
import {
  demoConcurrentHint,
  demoSaveCount,
  demoWeeklyViews,
  formatDemoCount,
} from "@/lib/demo-stats";

type Props = {
  params: { slug: string };
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pattern = await getPatternBySlug(params.slug);
  if (!pattern) {
    return {
      title: "Pattern not found | PerlerHub",
      description: "This pattern is unavailable.",
    };
  }
  return {
    title: pattern.seo_title || `${pattern.title} Pattern | PerlerHub`,
    description:
      pattern.seo_description ||
      pattern.description.slice(0, 155) ||
      "Detailed bead pattern with size and color requirements.",
    openGraph: {
      title: pattern.title,
      description: pattern.description,
      images: [pattern.image_url],
      type: "article",
    },
  };
}

export default async function PatternDetailPage({ params }: Props) {
  const pattern = await getPatternBySlug(params.slug);
  if (!pattern) notFound();
  const related = await getRelatedPatterns(pattern.slug);
  const shareUrl = absoluteUrl(`/patterns/${params.slug}`);
  const demoViews = demoWeeklyViews(pattern.slug);
  const demoSaves = demoSaveCount(pattern.slug);
  const demoPeers = demoConcurrentHint(pattern.slug);

  const categoryCrumb = pattern.tags[0]
    ? pattern.tags[0].charAt(0).toUpperCase() + pattern.tags[0].slice(1)
    : "Patterns";
  const published = pattern.created_at
    ? new Date(pattern.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;
  const author = pattern.author_name || "PerlerHub Community";

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <section className="space-y-6">
          <nav className="text-sm text-ink-500">
            <Link href="/" className="hover:text-ink-700">
              Home
            </Link>{" "}
            /{" "}
            <Link href="/patterns" className="hover:text-ink-700">
              Patterns
            </Link>{" "}
            /{" "}
            <span className="text-ink-600">{categoryCrumb}</span> /{" "}
            <span className="text-ink-700">{pattern.title}</span>
          </nav>

          <div className="overflow-hidden rounded-2xl border border-ink-200 shadow-sm">
            <RemoteCoverImage
              variant="fixed"
              src={pattern.image_url}
              alt={pattern.title}
              width={1280}
              height={920}
              className="w-full object-cover"
              priority
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-bold tracking-tight text-ink-900">{pattern.title}</h1>
            <ShareButtons title={pattern.title} fullUrl={shareUrl} />
          </div>

          <p className="text-sm text-ink-500">
            <span className="font-medium text-ink-700">By {author}</span>
            {published && (
              <>
                {" "}
                · Published {published}
              </>
            )}
          </p>

          <div className="max-w-none space-y-4 text-ink-800">
            <p>{pattern.description}</p>
            <p className="text-ink-700">
              Use the color list to shop single-color refills or a complete kit. This page is
              optimized for search — bookmark it for your next project build.
            </p>
          </div>

          <p className="text-sm text-ink-500">
            Tags: {pattern.tags.length ? pattern.tags.join(", ") : "general"}
          </p>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-ink-900">Related patterns</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {related.map((item) => (
                <PatternCard key={item.id} pattern={item} />
              ))}
            </div>
          </section>
        </section>

        <aside className="h-fit space-y-6 rounded-2xl border border-ink-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <div>
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                pattern.difficulty === "Beginner"
                  ? "bg-emerald-100 text-emerald-800"
                  : pattern.difficulty === "Intermediate"
                    ? "bg-amber-100 text-amber-900"
                    : "bg-rose-100 text-rose-900"
              }`}
            >
              {pattern.difficulty}
            </span>
          </div>

          <div
            className="rounded-xl border border-dashed border-ink-200 bg-ink-50/80 px-3 py-2.5 text-xs text-ink-600"
            title="Illustrative numbers for the demo — not live analytics."
          >
            <span className="font-semibold text-ink-800">Sample activity (demo):</span>{" "}
            <span className="font-medium text-ink-900">{formatDemoCount(demoViews)}</span> profile views (7d) ·{" "}
            <span className="font-medium text-ink-900">{demoSaves}</span> kit saves ·{" "}
            <span className="font-medium text-ink-900">{demoPeers}</span> sim. concurrent readers
          </div>

          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium text-ink-700">Board size:</span>{" "}
              {pattern.peg_width} × {pattern.peg_height} pegs
            </p>
            <p>
              <span className="font-medium text-ink-700">Bead count (est.):</span> {pattern.bead_count}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">
              Colors required
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {pattern.colors_required.map((color) => (
                <li
                  key={`${color.color_name}-${color.hex}`}
                  className="flex items-center justify-between"
                >
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="inline-block h-3.5 w-3.5 rounded-full border border-ink-200"
                      style={{ backgroundColor: color.hex }}
                    />
                    {color.color_name}: {color.count} beads
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 border-t border-ink-100 pt-4">
            <BuyKitButton patternId={pattern.id} patternTitle={pattern.title} />
            <button
              type="button"
              disabled
              title="Coming soon — register to download"
              className="w-full cursor-not-allowed rounded-xl border border-ink-200 px-4 py-3 text-sm font-semibold text-ink-400"
            >
              Download PDF Pattern
            </button>
            <Link
              href="/wholesale"
              className="block w-full rounded-xl border border-ink-200 px-4 py-3 text-center text-sm font-semibold text-ink-700 hover:bg-ink-50"
            >
              Need bulk supply?
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
