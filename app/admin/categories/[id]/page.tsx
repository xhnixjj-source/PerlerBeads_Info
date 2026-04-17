import { AdminDetailShell } from "@/components/admin/AdminDetailShell";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

type Props = { params: { id: string } };

export default async function EditCategoryPage({ params }: Props) {
  const supabase = createSupabaseServiceClient();
  if (!supabase) notFound();
  const { data } = await supabase.from("categories").select("*").eq("id", params.id).maybeSingle();
  if (!data) notFound();

  return (
    <AdminDetailShell title={String(data.name ?? "Category")} subtitle={`Slug: ${String(data.slug ?? "")}`} backHref="/admin/categories">
      <CategoryForm initial={data as Record<string, unknown>} />
    </AdminDetailShell>
  );
}
