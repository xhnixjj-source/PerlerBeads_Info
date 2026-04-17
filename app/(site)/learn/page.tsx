import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn Perler Beads | PerlerHub",
  description:
    "Guides for buying beads, choosing pegboards, and planning beginner to advanced projects.",
};

const tutorials = [
  {
    title: "Beginner project walkthrough",
    summary: "Step-by-step: ironing pressure, tape method vs direct fuse, and fixing warped boards.",
  },
  {
    title: "Palette Planning for 32x32",
    summary: "Tips to reduce color waste and estimate bead count before building large sprites.",
  },
];

const buyingGuides = [
  {
    title: "Beginner Buying Guide",
    summary: "How many colors, pegboards, and tools you actually need for your first 3 projects.",
  },
  {
    title: "Wholesale Checklist",
    summary:
      "MOQ, lead time, certifications, and payment terms to confirm before placing factory orders.",
  },
];

export default function LearnPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">Learn</h1>
      <p className="mt-2 text-ink-600">Tutorials and practical checklists for creators and buyers.</p>

      <section id="tutorials" className="mt-10 scroll-mt-24">
        <h2 className="text-xl font-semibold text-ink-900">Tutorials</h2>
        <div className="mt-4 space-y-4">
          {tutorials.map((guide) => (
            <article
              key={guide.title}
              className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-ink-900">{guide.title}</h3>
              <p className="mt-2 text-sm text-ink-700">{guide.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="buying-guide" className="mt-12 scroll-mt-24">
        <h2 className="text-xl font-semibold text-ink-900">Buying Guide</h2>
        <div className="mt-4 space-y-4">
          {buyingGuides.map((guide) => (
            <article
              key={guide.title}
              className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-ink-900">{guide.title}</h3>
              <p className="mt-2 text-sm text-ink-700">{guide.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
