import Image from "next/image";
import Link from "next/link";
import type { Supplier } from "@/lib/types/supplier";
import { demoSupplierInquiries30d, demoSupplierResponseHours } from "@/lib/demo-stats";

type Props = {
  supplier: Supplier;
};

export function HomeSupplierCard({ supplier }: Props) {
  const cover = supplier.gallery_urls?.[0];

  return (
    <article className="overflow-hidden rounded-2xl border border-ink-200/90 bg-white shadow-md">
      <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-brand-mint/40 to-brand-lavender/30">
        {cover ? (
          <Image src={cover} alt="" fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
        ) : (
          <div className="flex h-full items-center justify-center font-heading text-4xl font-bold text-brand-text/20">
            {supplier.company_name.slice(0, 1)}
          </div>
        )}
        {supplier.is_verified && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
            ✓ Verified
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-heading text-lg font-bold text-brand-text">{supplier.company_name}</h3>
        <p className="mt-1 text-sm text-brand-text/65">{supplier.location}</p>
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-brand-text/50">
          {supplier.factory_type}
        </p>
        <p
          className="mt-2 text-[11px] leading-snug text-brand-text/55"
          title="Illustrative numbers for the demo — not live analytics."
        >
          <span className="font-semibold text-brand-text/70">
            ~{demoSupplierInquiries30d(supplier.slug)}
          </span>{" "}
          inquiries (30d, sim.)
          <span className="text-brand-text/40"> · </span>
          reply often under{" "}
          <span className="font-semibold text-brand-text/70">{demoSupplierResponseHours(supplier.slug)}h</span>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {supplier.main_products.slice(0, 3).map((p) => (
            <span
              key={p}
              className="rounded-full bg-brand-yellow/35 px-2.5 py-1 text-xs font-medium text-brand-text"
            >
              {p}
            </span>
          ))}
        </div>
        <Link
          href={`/suppliers/${supplier.slug}`}
          className="mt-4 inline-flex w-full items-center justify-center rounded-full border-2 border-brand-secondary bg-white py-2.5 text-sm font-bold text-brand-secondary transition hover:bg-brand-secondary/10"
        >
          Visit shop
        </Link>
      </div>
    </article>
  );
}
