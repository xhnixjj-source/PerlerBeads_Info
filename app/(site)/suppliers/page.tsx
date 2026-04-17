import type { Metadata } from "next";
import { getSuppliers } from "@/lib/catalog";
import { SupplierCard } from "@/components/SupplierCard";

export const metadata: Metadata = {
  title: "Perler Suppliers Directory | PerlerHub",
  description:
    "Find verified Chinese fuse bead manufacturers, pegboard suppliers, and OEM packaging partners.",
};

export const dynamic = "force-dynamic";

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-ink-900 sm:text-4xl">
          Supplier Directory
        </h1>
        <p className="mt-2 max-w-3xl text-ink-600">
          <span className="mr-2 inline-block rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-medium text-ink-700">
            {suppliers.length} listings
          </span>
          Browse source factories and equipment vendors. Compare MOQ, lead time, and send direct
          inquiries.
        </p>
      </header>

      {suppliers.length === 0 ? (
        <p className="rounded-2xl border border-ink-200 bg-ink-50 p-8 text-center text-ink-600">
          No suppliers are listed yet. Check back soon.
        </p>
      ) : (
        <section className="grid gap-5 md:grid-cols-2">
          {suppliers.map((supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </section>
      )}
    </main>
  );
}
