import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPatternBySlug, getRelatedPatterns } from "@/lib/catalog";
import { PatternCard } from "@/components/PatternCard";

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

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <section className="space-y-5">
          <nav className="text-sm text-ink-500">
            <Link href="/" className="hover:text-ink-700">
              Home
            </Link>{" "}
            /{" "}
            <Link href="/patterns" className="hover:text-ink-700">
              Patterns
            </Link>{" "}
            / <span className="text-ink-700">{pattern.title}</span>
          </nav>
          <Image
            src={pattern.image_url}
            alt={pattern.title}
            width={1280}
            height={920}
            className="w-full rounded-2xl border border-ink-200 object-cover shadow-sm"
          />
          <h1 className="text-3xl font-bold tracking-tight text-ink-900">{pattern.title}</h1>
          <p className="text-ink-700">{pattern.description}</p>
          <p className="text-sm text-ink-500">
            Tags: {pattern.tags.length ? pattern.tags.join(", ") : "general"}
          </p>
        </section>

        <aside className="h-fit space-y-6 rounded-2xl border border-ink-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium text-ink-700">Difficulty:</span> {pattern.difficulty}
            </p>
            <p>
              <span className="font-medium text-ink-700">Board size:</span> {pattern.peg_width} x{" "}
              {pattern.peg_height}
            </p>
            <p>
              <span className="font-medium text-ink-700">Bead count:</span> {pattern.bead_count}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">
              Colors required
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {pattern.colors_required.map((color) => (
                <li key={`${color.color_name}-${color.hex}`} className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="inline-block h-3.5 w-3.5 rounded-full border border-ink-200"
                      style={{ backgroundColor: color.hex }}
                    />
                    {color.color_name}
                  </span>
                  <span className="text-ink-600">{color.count}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-hover"
            >
              Buy Complete Kit - $9.99
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

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-semibold text-ink-900">Related patterns</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <PatternCard key={item.id} pattern={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
