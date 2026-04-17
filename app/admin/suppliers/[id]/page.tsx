import { AdminDetailShell } from "@/components/admin/AdminDetailShell";
import { AdminFormPlaceholder } from "@/components/admin/AdminFormPlaceholder";
import { normalizeSupplierRow } from "@/lib/catalog";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminSupplierDetailPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServiceClient();
  if (!supabase) notFound();

  const { data } = await supabase.from("suppliers").select("*").eq("id", params.id).maybeSingle();
  if (!data) notFound();

  const s = normalizeSupplierRow(data as Record<string, unknown>);

  return (
    <AdminDetailShell title={s.company_name} subtitle={`Slug: ${s.slug}`} backHref="/admin/suppliers">
      <AdminFormPlaceholder entity="supplier" />
    </AdminDetailShell>
  );
}
