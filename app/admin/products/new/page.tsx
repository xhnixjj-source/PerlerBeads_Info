import { AdminDetailShell } from "@/components/admin/AdminDetailShell";
import { AdminProductForm } from "@/components/admin/AdminProductForm";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const supabase = createSupabaseServiceClient();
  const categories =
    supabase == null
      ? []
      : ((await supabase.from("categories").select("id,name,slug").order("sort_order", { ascending: true })).data ??
        []);

  return (
    <AdminDetailShell title="New product" subtitle="Self-serve store SKU with category and listing status." backHref="/admin/products">
      <AdminProductForm categories={categories as { id: string; name: string; slug: string }[]} initial={null} />
    </AdminDetailShell>
  );
}
