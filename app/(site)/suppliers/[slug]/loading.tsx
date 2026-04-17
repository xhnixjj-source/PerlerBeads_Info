export default function SupplierDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-4 h-4 w-56 animate-pulse rounded bg-ink-100" />
      <header className="mb-8 rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="h-9 w-64 animate-pulse rounded-lg bg-ink-200 sm:w-96" />
          <div className="h-7 w-36 animate-pulse rounded-full bg-ink-100" />
        </div>
        <div className="mt-3 h-4 w-48 animate-pulse rounded bg-ink-50" />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-ink-50" />
          ))}
        </div>
      </header>
      <div className="grid gap-8 lg:grid-cols-[1.45fr_1fr]">
        <section className="space-y-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl border border-ink-200 bg-white" />
          ))}
        </section>
        <aside className="h-96 animate-pulse rounded-2xl border border-ink-200 bg-white" />
      </div>
    </main>
  );
}
