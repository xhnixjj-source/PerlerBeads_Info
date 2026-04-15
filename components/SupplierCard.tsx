import Link from "next/link";
import type { Supplier } from "@/lib/types/supplier";

type Props = {
  supplier: Supplier;
};

export function SupplierCard({ supplier }: Props) {
  return (
    <article className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-ink-900">{supplier.company_name}</h3>
        {supplier.is_verified && (
          <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
            Verified
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-ink-600">{supplier.location}</p>
      <p className="mt-3 line-clamp-2 text-sm text-ink-700">{supplier.description}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-ink-100 px-2 py-1 text-ink-700">{supplier.factory_type}</span>
        <span className="rounded-full bg-ink-100 px-2 py-1 text-ink-700">MOQ: {supplier.moq}</span>
      </div>
      <Link
        href={`/suppliers/${supplier.slug}`}
        className="mt-5 inline-flex rounded-lg bg-ink-900 px-3 py-2 text-sm font-medium text-white hover:bg-ink-800"
      >
        View supplier
      </Link>
    </article>
  );
}
