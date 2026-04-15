import Link from "next/link";
import { Generator } from "@/components/Generator";
import { InquiryForm } from "@/components/InquiryForm";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-ink-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-sm font-semibold tracking-tight text-ink-900">
            Bead Pattern Lab
          </span>
          <Link
            href="/wholesale"
            className="text-sm font-medium text-accent hover:text-accent-hover"
          >
            Wholesale
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
            Image to Bead Pattern Generator
          </h1>
          <p className="mt-3 text-ink-600">
            Upload a photo — get a square pixel grid you can recreate with fuse beads (Perler /
            拼豆 style).
          </p>
        </div>

        <div className="mt-10">
          <Generator />
        </div>

        <section className="mt-12 rounded-2xl border border-ink-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-ink-900">Need bead kit for this design?</p>
          <p className="mt-2 text-ink-600">Contact us for bulk supply</p>
          <Link
            href="/wholesale"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-ink-800"
          >
            Go to Wholesale
          </Link>
        </section>

        <section className="mt-14">
          <h2 className="text-lg font-semibold text-ink-900">Quick inquiry</h2>
          <p className="mt-1 text-sm text-ink-600">
            Prefer to message us without leaving this page? Use the form below.
          </p>
          <div className="mt-6 rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
            <InquiryForm source="home" />
          </div>
        </section>
      </main>

      <footer className="border-t border-ink-200 py-8 text-center text-xs text-ink-500">
        MVP for traffic & lead tests — not affiliated with any bead brand.
      </footer>
    </div>
  );
}
