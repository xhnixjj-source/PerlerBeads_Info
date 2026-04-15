import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/InquiryForm";
import { getSupplierBySlug } from "@/lib/catalog";

type Props = {
  params: { slug: string };
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supplier = await getSupplierBySlug(params.slug);
  if (!supplier) return { title: "Supplier not found | PerlerHub" };
  return {
    title: `${supplier.company_name} | Perler Supplier Profile`,
    description: `${supplier.company_name} in ${supplier.location}. MOQ ${supplier.moq}. ${supplier.factory_type} supplier profile on PerlerHub.`,
  };
}

export default async function SupplierDetailPage({ params }: Props) {
  const supplier = await getSupplierBySlug(params.slug);
  if (!supplier) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <nav className="mb-4 text-sm text-ink-500">
        <Link href="/" className="hover:text-ink-700">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/suppliers" className="hover:text-ink-700">
          Suppliers
        </Link>{" "}
        / <span className="text-ink-700">{supplier.company_name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.45fr_1fr]">
        <section className="space-y-6">
          <header className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-ink-900">{supplier.company_name}</h1>
              {supplier.is_verified && (
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  Verified Manufacturer
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-ink-500">{supplier.location}</p>
            <p className="mt-4 text-ink-700">{supplier.description}</p>
          </header>

          <section className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-ink-900">Main Products</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {supplier.main_products.length ? (
                supplier.main_products.map((product) => (
                  <li key={product} className="rounded-lg bg-ink-100 px-3 py-2 text-sm text-ink-700">
                    {product}
                  </li>
                ))
              ) : (
                <li className="text-sm text-ink-500">Product catalog available upon inquiry.</li>
              )}
            </ul>
          </section>

          <section className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-ink-900">Certifications</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {supplier.certification_badges.length ? (
                supplier.certification_badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-ink-200 bg-ink-50 px-3 py-1 text-xs text-ink-700"
                  >
                    {badge}
                  </span>
                ))
              ) : (
                <p className="text-sm text-ink-500">Certification details provided to qualified buyers.</p>
              )}
            </div>
          </section>
        </section>

        <aside className="space-y-5 rounded-2xl border border-ink-200 bg-white p-6 shadow-sm lg:sticky lg:top-6 lg:h-fit">
          <h2 className="text-lg font-semibold text-ink-900">Trade Terms</h2>
          <ul className="space-y-2 text-sm text-ink-700">
            <li>
              <span className="font-medium text-ink-800">Factory Type:</span> {supplier.factory_type}
            </li>
            <li>
              <span className="font-medium text-ink-800">MOQ:</span> {supplier.moq}
            </li>
            <li>
              <span className="font-medium text-ink-800">Lead Time:</span> {supplier.lead_time}
            </li>
            <li>
              <span className="font-medium text-ink-800">Payment:</span>{" "}
              {supplier.accepted_payment.length ? supplier.accepted_payment.join(", ") : "Negotiable"}
            </li>
          </ul>

          <div className="border-t border-ink-200 pt-5">
            <h3 className="text-base font-semibold text-ink-900">Send Inquiry</h3>
            <p className="mt-1 text-sm text-ink-600">
              Share your target quantity and packaging requirements.
            </p>
            <div className="mt-4">
              <InquiryForm source="supplier" supplierId={supplier.id} backLabel="Back to suppliers" />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
