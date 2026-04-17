export default function PatternsLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-3">
          <div className="h-9 w-64 animate-pulse rounded-lg bg-ink-200 sm:h-10 sm:w-80" />
          <div className="h-4 w-full max-w-md animate-pulse rounded bg-ink-100" />
        </div>
        <div className="h-10 w-40 animate-pulse rounded-xl bg-ink-200" />
      </div>
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm"
          >
            <div className="h-44 animate-pulse bg-ink-100" />
            <div className="space-y-3 p-4">
              <div className="flex justify-between gap-2">
                <div className="h-6 w-20 animate-pulse rounded-full bg-ink-100" />
                <div className="h-4 w-14 animate-pulse rounded bg-ink-100" />
              </div>
              <div className="h-5 w-3/4 animate-pulse rounded bg-ink-100" />
              <div className="h-4 w-full animate-pulse rounded bg-ink-50" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-ink-50" />
              <div className="h-9 w-28 animate-pulse rounded-lg bg-ink-200" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
