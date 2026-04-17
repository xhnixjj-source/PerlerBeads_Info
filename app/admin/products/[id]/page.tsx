import { AdminDetailShell } from "@/components/admin/AdminDetailShell";
import { AdminProductForm } from "@/components/admin/AdminProductForm";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

type Props = { params: { id: string } };

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: Props) {
  const supabase = createSupabaseServiceClient();
  if (!supabase) notFound();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*, category:categories(id, name, slug)").eq("id", params.id).maybeSingle(),
    supabase.from("categories").select("id,name,slug").order("sort_order", { ascending: true }),
  ]);

  if (!product) notFound();

  const name = String(product.name ?? "Product");

  return (
    <AdminDetailShell title={name} subtitle={product.slug ? `Slug: ${String(product.slug)}` : undefined} backHref="/admin/products">
      <AdminProductForm
        categories={(categories ?? []) as { id: string; name: string; slug: string }[]}
        initial={product as Record<string, unknown>}
      />
    </AdminDetailShell>
  );
}
