export default function PatternDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <section className="space-y-6">
          <div className="h-4 w-64 animate-pulse rounded bg-ink-100" />
          <div className="aspect-[1280/920] w-full animate-pulse rounded-2xl bg-ink-100" />
          <div className="h-10 w-2/3 animate-pulse rounded-lg bg-ink-200" />
          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-ink-50" />
            <div className="h-4 w-full animate-pulse rounded bg-ink-50" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-ink-50" />
          </div>
          <div>
            <div className="mb-4 h-6 w-40 animate-pulse rounded bg-ink-100" />
            <div className="grid gap-5 sm:grid-cols-2">
              {[0, 1].map((i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
                  <div className="h-36 animate-pulse bg-ink-100" />
                  <div className="space-y-2 p-4">
                    <div className="h-4 w-24 animate-pulse rounded bg-ink-100" />
                    <div className="h-4 w-full animate-pulse rounded bg-ink-50" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <aside className="space-y-4 rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
          <div className="h-7 w-24 animate-pulse rounded-full bg-ink-100" />
          <div className="h-4 w-full animate-pulse rounded bg-ink-50" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-ink-50" />
          <div className="mt-6 space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-ink-50" />
            <div className="h-4 w-full animate-pulse rounded bg-ink-50" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-ink-50" />
          </div>
        </aside>
      </div>
    </main>
  );
}
