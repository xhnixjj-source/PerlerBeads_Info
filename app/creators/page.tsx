import type { Metadata } from "next";
import { getFeaturedCreators } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Creator Network | PerlerHub",
  description: "Discover featured bead artists and creators across TikTok, YouTube, and Instagram.",
};

export default async function CreatorsPage() {
  const creators = await getFeaturedCreators();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">Creator Network</h1>
      <p className="mt-2 text-ink-600">Featured creators and community builders in the bead scene.</p>
      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        {creators.map((creator) => (
          <article key={creator.id} className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm">
            <p className="text-lg font-semibold text-ink-900">{creator.name}</p>
            <p className="mt-1 text-sm text-ink-500">{creator.platform}</p>
            <p className="mt-3 text-sm text-ink-700">{creator.bio}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
