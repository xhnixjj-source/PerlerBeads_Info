import Link from "next/link";
import Image from "next/image";
import type { Pattern } from "@/lib/types/pattern";
import { demoSaveCount, demoWeeklyViews, formatDemoCount } from "@/lib/demo-stats";

type Props = {
  pattern: Pattern;
};

export function PatternCard({ pattern }: Props) {
  return (
    <article className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm">
      <Image
        src={pattern.image_url}
        alt={pattern.title}
        width={640}
        height={440}
        className="h-44 w-full object-cover"
        loading="lazy"
      />
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="rounded-full bg-ink-100 px-2 py-1 text-ink-700">{pattern.difficulty}</span>
          <span className="text-ink-500">
            {pattern.peg_width}x{pattern.peg_height}
          </span>
        </div>
        <h3 className="line-clamp-2 text-base font-semibold text-ink-900">{pattern.title}</h3>
        <p className="line-clamp-2 text-sm text-ink-600">{pattern.description}</p>
        <p
          className="text-[11px] text-ink-500"
          title="Illustrative numbers for the demo — not live analytics."
        >
          Demo pulse:{" "}
          <span className="font-medium text-ink-700">{formatDemoCount(demoWeeklyViews(pattern.slug))}</span>{" "}
          views/wk ·{" "}
          <span className="font-medium text-ink-700">{demoSaveCount(pattern.slug)}</span> saves
        </p>
        <Link
          href={`/patterns/${pattern.slug}`}
          className="inline-flex rounded-lg bg-ink-900 px-3 py-2 text-sm font-medium text-white hover:bg-ink-800"
        >
          View pattern
        </Link>
      </div>
    </article>
  );
}
