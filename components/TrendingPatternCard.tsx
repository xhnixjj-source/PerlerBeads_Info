import Link from "next/link";
import { RemoteCoverImage } from "@/components/RemoteCoverImage";
import type { Pattern } from "@/lib/types/pattern";
import { formatLikeCount, stableLikeCount } from "@/lib/engagement";
import {
  demoConcurrentHint,
  demoSaveCount,
  demoWeeklyViews,
  formatDemoCount,
} from "@/lib/demo-stats";
import { paletteColorCount } from "@/lib/pattern-utils";

type Props = {
  pattern: Pattern;
};

export function TrendingPatternCard({ pattern }: Props) {
  const colors = paletteColorCount(pattern);
  const likes = pattern.like_count ?? stableLikeCount(pattern.id);
  const author = pattern.author_name ?? "Community";
  const views = demoWeeklyViews(pattern.slug);
  const saves = demoSaveCount(pattern.slug);
  const peers = demoConcurrentHint(pattern.slug);

  return (
    <article className="w-[min(260px,85vw)] shrink-0 snap-start overflow-hidden rounded-2xl border border-ink-200/90 bg-white shadow-md">
      <div className="h-1.5 bg-gradient-to-r from-brand-primary via-brand-yellow to-brand-secondary" />
      <div className="relative h-36 w-full">
        <RemoteCoverImage
          variant="fill"
          src={pattern.image_url}
          alt={pattern.title}
          className="object-cover"
          sizes="260px"
        />
        <span
          className="absolute left-1 top-1 h-2 w-2 rounded-[2px] bg-brand-mint shadow-sm"
          aria-hidden
        />
        <span
          className="absolute right-1 top-1 h-2 w-2 rounded-[2px] bg-brand-lavender shadow-sm"
          aria-hidden
        />
        <span
          className="absolute bottom-1 left-1 h-2 w-2 rounded-[2px] bg-brand-yellow shadow-sm"
          aria-hidden
        />
        <span
          className="absolute bottom-1 right-1 h-2 w-2 rounded-[2px] bg-brand-primary shadow-sm"
          aria-hidden
        />
      </div>
      <div className="space-y-2 p-3">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="rounded-full bg-brand-mint/50 px-2 py-0.5 font-medium text-brand-text/90">
            {pattern.difficulty}
          </span>
          <span className="text-brand-text/60">{colors} colors</span>
        </div>
        <h3 className="line-clamp-2 font-heading text-base font-bold text-brand-text">{pattern.title}</h3>
        <p className="text-xs text-brand-text/65">by {author}</p>
        <div className="flex items-center gap-1.5 text-xs text-rose-500">
          <HeartIcon />
          <span className="font-semibold">{formatLikeCount(likes)}</span>
        </div>
        <p
          className="text-[11px] leading-snug text-brand-text/55"
          title="Illustrative numbers for the demo — not live analytics."
        >
          <span className="font-semibold text-brand-text/70">{formatDemoCount(views)}</span> views/wk
          <span className="text-brand-text/40"> · </span>
          <span className="font-semibold text-brand-text/70">{saves}</span> saves
          <span className="text-brand-text/40"> · </span>
          <span className="font-semibold text-brand-text/70">{peers}</span> sim. active
        </p>
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            disabled
            title="PDF export — coming soon"
            className="w-full cursor-not-allowed rounded-full bg-brand-mint py-2 text-center text-xs font-bold text-brand-text/50"
          >
            Download PDF
          </button>
          <Link
            href={`/patterns/${pattern.slug}`}
            className="block w-full rounded-full border-2 border-brand-primary/80 bg-white py-2 text-center text-xs font-bold text-brand-primary-deep transition hover:bg-brand-primary/10"
          >
            View pattern
          </Link>
        </div>
      </div>
    </article>
  );
}

function HeartIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}
