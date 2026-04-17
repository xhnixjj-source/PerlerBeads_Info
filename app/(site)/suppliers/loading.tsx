export default function SuppliersLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8 space-y-3">
        <div className="h-9 w-72 animate-pulse rounded-lg bg-ink-200 sm:h-10 sm:w-96" />
        <div className="h-4 w-full max-w-3xl animate-pulse rounded bg-ink-100" />
        <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-ink-50" />
      </header>
      <section className="grid gap-5 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm">
            <div className="flex justify-between gap-3">
              <div className="h-6 w-48 animate-pulse rounded bg-ink-100" />
              <div className="h-6 w-16 animate-pulse rounded-full bg-ink-100" />
            </div>
            <div className="mt-3 h-4 w-40 animate-pulse rounded bg-ink-50" />
            <div className="mt-3 space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-ink-50" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-ink-50" />
            </div>
            <div className="mt-4 flex gap-2">
              <div className="h-6 w-24 animate-pulse rounded-full bg-ink-100" />
              <div className="h-6 w-28 animate-pulse rounded-full bg-ink-100" />
            </div>
            <div className="mt-5 h-9 w-32 animate-pulse rounded-lg bg-ink-200" />
          </div>
        ))}
      </section>
    </main>
  );
}
