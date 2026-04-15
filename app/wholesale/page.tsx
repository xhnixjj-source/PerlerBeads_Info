import type { Metadata } from "next";
import Link from "next/link";
import { InquiryForm } from "@/components/InquiryForm";

export const metadata: Metadata = {
  title: "Wholesale & Bulk | Bead Pattern Lab",
  description: "MOQ, OEM, and bulk fuse bead supply. Request a quote.",
};

export default function WholesalePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-4">
          <Link href="/suppliers" className="text-sm font-semibold tracking-tight text-ink-900">
            Browse supplier directory →
          </Link>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          Wholesale & OEM
        </h1>
        <p className="mt-3 text-lg text-ink-600">
          We help creators and retailers source fuse bead kits, sorted colors, and custom
          packaging.
        </p>

        <section className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">
              Product
            </h2>
            <p className="mt-2 text-ink-800">
              Standard 5mm fuse beads, pegboards, ironing paper, and color-sorted refills. Tell us
              your market (EU/US) for compliance notes.
            </p>
          </div>
          <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">MOQ</h2>
            <p className="mt-2 text-ink-800">
              Bulk orders typically start around <strong>50–100 kits</strong> depending on SKU mix
              (indicative — we&apos;ll confirm on quote).
            </p>
          </div>
          <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm sm:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">
              OEM & branding
            </h2>
            <p className="mt-2 text-ink-800">
              Logo on box, insert cards, and multi-language labels available for qualified volumes.
              Share your timeline and target retail price — we&apos;ll propose a feasible spec.
            </p>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-ink-900">Request a quote</h2>
          <p className="mt-1 text-sm text-ink-600">
            Leave your email and what you need — we&apos;ll reply with next steps.
          </p>
          <div className="mt-6 rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
            <InquiryForm source="wholesale" backLabel="Back to home" />
          </div>
        </section>
    </main>
  );
}
