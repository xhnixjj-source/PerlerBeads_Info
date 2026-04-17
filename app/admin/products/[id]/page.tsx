import { AdminDetailShell } from "@/components/admin/AdminDetailShell";
import { AdminFormPlaceholder } from "@/components/admin/AdminFormPlaceholder";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServiceClient();
  if (!supabase) notFound();

  const { data } = await supabase.from("products").select("*").eq("id", params.id).maybeSingle();
  if (!data) notFound();

  const name = String((data as { name?: string }).name ?? "Product");
  const slug = String((data as { slug?: string }).slug ?? "");

  return (
    <AdminDetailShell title={name} subtitle={slug ? `Slug: ${slug}` : undefined} backHref="/admin/products">
      <AdminFormPlaceholder entity="product" />
    </AdminDetailShell>
  );
}
