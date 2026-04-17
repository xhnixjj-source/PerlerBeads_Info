import type { Metadata } from "next";
import Link from "next/link";
import { InquiryForm } from "@/components/InquiryForm";
import { getRequestLocale } from "@/lib/i18n/server";
import { getMessages } from "@/messages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const loc = getRequestLocale();
  const m = getMessages(loc);
  return { title: m.meta.wholesaleTitle, description: m.meta.wholesaleDesc };
}

export default function WholesalePage() {
  const m = getMessages(getRequestLocale());
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-4">
        <Link href="/suppliers" className="text-sm font-semibold tracking-tight text-ink-900">
          {m.wholesale.browseDir}
        </Link>
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">{m.wholesale.title}</h1>
      <p className="mt-3 text-lg text-ink-600">{m.wholesale.lead}</p>

      <section className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">{m.wholesale.productH}</h2>
          <p className="mt-2 text-ink-800">{m.wholesale.productP}</p>
        </div>
        <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">{m.wholesale.moqH}</h2>
          <p className="mt-2 text-ink-800">{m.wholesale.moqP}</p>
        </div>
        <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm sm:col-span-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-500">{m.wholesale.oemH}</h2>
          <p className="mt-2 text-ink-800">{m.wholesale.oemP}</p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold text-ink-900">{m.wholesale.quoteH}</h2>
        <p className="mt-1 text-sm text-ink-600">{m.wholesale.quoteP}</p>
        <div className="mt-6 rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
          <InquiryForm source="wholesale" backLabel={m.inquiry.backHome} />
        </div>
      </section>
    </main>
  );
}
