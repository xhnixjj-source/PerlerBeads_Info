import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn Perler Beads | PerlerHub",
  description: "Guides for buying beads, choosing pegboards, and planning beginner to advanced projects.",
};

const guides = [
  {
    title: "Beginner Buying Guide",
    summary: "How many colors, pegboards, and tools you actually need for your first 3 projects.",
  },
  {
    title: "Palette Planning for 32x32",
    summary: "Tips to reduce color waste and estimate bead count before building large sprites.",
  },
  {
    title: "Wholesale Checklist",
    summary: "MOQ, lead time, certifications, and payment terms to confirm before placing factory orders.",
  },
];

export default function LearnPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">Learn</h1>
      <p className="mt-2 text-ink-600">Tutorials and practical checklists for creators and buyers.</p>
      <section className="mt-8 space-y-4">
        {guides.map((guide) => (
          <article key={guide.title} className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-ink-900">{guide.title}</h2>
            <p className="mt-2 text-sm text-ink-700">{guide.summary}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
