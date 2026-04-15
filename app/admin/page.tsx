import Link from "next/link";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

async function getCount(table: string) {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return 0;
  const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
  return count || 0;
}

export default async function AdminOverviewPage() {
  const [patternCount, supplierCount, inquiryCount] = await Promise.all([
    getCount("patterns"),
    getCount("suppliers"),
    getCount("inquiries"),
  ]);

  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <article className="rounded-xl border border-ink-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-ink-500">Patterns</p>
        <p className="mt-2 text-3xl font-bold text-ink-900">{patternCount}</p>
        <Link href="/admin/patterns" className="mt-3 inline-block text-sm text-accent hover:text-accent-hover">
          Manage →
        </Link>
      </article>
      <article className="rounded-xl border border-ink-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-ink-500">Suppliers</p>
        <p className="mt-2 text-3xl font-bold text-ink-900">{supplierCount}</p>
        <Link href="/admin/suppliers" className="mt-3 inline-block text-sm text-accent hover:text-accent-hover">
          Manage →
        </Link>
      </article>
      <article className="rounded-xl border border-ink-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-ink-500">Inquiries</p>
        <p className="mt-2 text-3xl font-bold text-ink-900">{inquiryCount}</p>
        <Link href="/admin/inquiries" className="mt-3 inline-block text-sm text-accent hover:text-accent-hover">
          Review →
        </Link>
      </article>
    </section>
  );
}
