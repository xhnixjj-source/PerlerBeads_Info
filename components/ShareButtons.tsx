"use client";

type Props = {
  title: string;
  /** Absolute URL for social share targets (computed on server). */
  fullUrl: string;
};

export function ShareButtons({ title, fullUrl }: Props) {
  const encoded = encodeURIComponent(fullUrl);
  const text = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-ink-500">Share</span>
      <a
        href={`https://pinterest.com/pin/create/button/?url=${encoded}&description=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border border-ink-200 px-2.5 py-1 text-xs text-ink-700 hover:bg-ink-50"
      >
        Pinterest
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border border-ink-200 px-2.5 py-1 text-xs text-ink-700 hover:bg-ink-50"
      >
        Facebook
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border border-ink-200 px-2.5 py-1 text-xs text-ink-700 hover:bg-ink-50"
      >
        Twitter
      </a>
    </div>
  );
}
