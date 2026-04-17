"use client";

import Link from "next/link";

export default function SupplierDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-lg rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
        <h1 className="text-lg font-semibold text-rose-900">Could not load this supplier</h1>
        <p className="mt-2 text-sm text-rose-800">{error.message}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-ink-800"
          >
            Try again
          </button>
          <Link
            href="/suppliers"
            className="text-sm font-medium text-rose-900 underline hover:no-underline"
          >
            Browse all suppliers
          </Link>
        </div>
      </div>
    </main>
  );
}
