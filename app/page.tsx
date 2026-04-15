import Image from "next/image";
import Link from "next/link";
import { CommunityCreations } from "@/components/CommunityCreations";
import { HomeHeroGenerator } from "@/components/HomeHeroGenerator";
import { InquiryForm } from "@/components/InquiryForm";
import { HomeSupplierCard } from "@/components/HomeSupplierCard";
import { TrendingPatternCard } from "@/components/TrendingPatternCard";
import {
  getHomeCreators,
  getTopSuppliersForHome,
  getTrendingPatterns,
} from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [trending, suppliers, creators] = await Promise.all([
    getTrendingPatterns(6),
    getTopSuppliersForHome(4),
    getHomeCreators(3),
  ]);

  const communityUrls = Array.from(
    new Set([
      ...creators.flatMap((c) => c.featured_works ?? []),
      ...trending.map((p) => p.image_url),
    ])
  ).slice(0, 12);

  return (
    <main>
      <HomeHeroGenerator />

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-14 sm:px-6">
        {/* Featured patterns */}
        <section>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-heading text-[1.75rem] font-extrabold text-brand-text sm:text-[28px]">
                Featured Bead Patterns
              </h2>
              <p className="mt-1 text-sm text-brand-text/70">
                Fresh pixel picks — download-ready when PDF export goes live.
              </p>
            </div>
            <Link
              href="/patterns"
              className="inline-flex items-center justify-center rounded-full border-2 border-brand-primary bg-white px-5 py-2 text-sm font-bold text-brand-primary-deep shadow-sm transition hover:bg-brand-primary/10"
            >
              View all
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {trending.map((p) => (
              <TrendingPatternCard key={p.id} pattern={p} />
            ))}
          </div>
        </section>

        {/* Directory */}
        <section>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-heading text-[1.75rem] font-extrabold text-brand-text sm:text-[28px]">
                Latest Directory Listings
              </h2>
              <p className="mt-1 text-sm text-brand-text/70">
                Shops, factories, and artists — verified partners when marked.
              </p>
            </div>
            <Link
              href="/suppliers"
              className="text-sm font-bold text-brand-secondary hover:text-brand-secondary-deep"
            >
              Browse directory →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {suppliers.map((s) => (
              <HomeSupplierCard key={s.id} supplier={s} />
            ))}
          </div>
        </section>

        {/* Community */}
        <section>
          <h2 className="mb-2 font-heading text-[1.75rem] font-extrabold text-brand-text sm:text-[28px]">
            Community Creations
          </h2>
          <p className="mb-6 text-sm text-brand-text/70">
            Real finishes from creators and pattern previews — tag us to be featured.
          </p>
          {communityUrls.length > 0 ? (
            <CommunityCreations imageUrls={communityUrls} />
          ) : (
            <p className="rounded-2xl border border-dashed border-ink-200/80 bg-white/80 py-12 text-center text-sm text-brand-text/60">
              Community photos coming soon.
            </p>
          )}
        </section>

        {/* Featured creators */}
        <section>
          <h2 className="mb-6 font-heading text-[1.75rem] font-extrabold text-brand-text sm:text-[28px]">
            Featured Creators
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {creators.map((c) => (
              <article
                key={c.id}
                className="overflow-hidden rounded-2xl border border-ink-200/90 bg-white shadow-md"
              >
                <div className="flex gap-4 p-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-brand-mint/40">
                    {c.avatar_url ? (
                      <Image src={c.avatar_url} alt="" fill className="object-cover" sizes="64px" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-2xl text-brand-text/35">
                        ?
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-brand-text">{c.name}</h3>
                    <p className="text-xs text-brand-text/55">{c.platform}</p>
                    <p className="mt-2 line-clamp-3 text-sm text-brand-text/80">{c.bio}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-1 border-t border-ink-100 p-2">
                  {(c.featured_works ?? []).slice(0, 3).map((src, i) => (
                    <div key={i} className="relative aspect-square">
                      <Image src={src} alt="" fill className="object-cover" sizes="120px" />
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* More tools */}
        <section>
          <h2 className="mb-6 font-heading text-[1.75rem] font-extrabold text-brand-text sm:text-[28px]">
            More tools
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <Link
              href="/tools/image-to-pattern"
              className="group rounded-2xl border border-ink-200/90 bg-white p-8 shadow-sm transition hover:border-brand-secondary hover:shadow-md"
            >
              <h3 className="font-heading text-lg font-bold text-brand-text group-hover:text-brand-secondary">
                Full-screen image to pattern
              </h3>
              <p className="mt-2 text-sm text-brand-text/75">
                Same engine with step-by-step layout — ideal for focused sessions.
              </p>
              <span className="mt-4 inline-block text-sm font-bold text-brand-secondary">Open tool →</span>
            </Link>
            <Link
              href="/tools/color-converter"
              className="group rounded-2xl border border-ink-200/90 bg-white p-8 shadow-sm transition hover:border-brand-primary hover:shadow-md"
            >
              <h3 className="font-heading text-lg font-bold text-brand-text group-hover:text-brand-primary">
                Brand Color Converter
              </h3>
              <p className="mt-2 text-sm text-brand-text/75">
                Map brand hex colors to fuse bead palettes (preview & export coming soon).
              </p>
              <span className="mt-4 inline-block text-sm font-bold text-brand-primary">Learn more →</span>
            </Link>
          </div>
        </section>

        {/* Lead capture */}
        <section id="quick-inquiry" className="rounded-3xl border border-ink-200/90 bg-white p-8 shadow-lg">
          <h2 className="font-heading text-xl font-bold text-brand-text">Quick inquiry</h2>
          <p className="mt-1 text-sm text-brand-text/70">
            Bulk kits, OEM, or partnership — leave a message and we&apos;ll follow up.
          </p>
          <div className="mt-6">
            <InquiryForm source="home" />
          </div>
        </section>
      </div>
    </main>
  );
}
