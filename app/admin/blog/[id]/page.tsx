import { AdminDetailShell } from "@/components/admin/AdminDetailShell";
import { AdminFormPlaceholder } from "@/components/admin/AdminFormPlaceholder";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminBlogDetailPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServiceClient();
  if (!supabase) notFound();

  const { data } = await supabase.from("blog_posts").select("*").eq("id", params.id).maybeSingle();
  if (!data) notFound();

  const title = String((data as { title?: string }).title ?? "Post");
  const slug = String((data as { slug?: string }).slug ?? "");

  return (
    <AdminDetailShell title={title} subtitle={slug ? `Slug: ${slug}` : undefined} backHref="/admin/blog">
      <AdminFormPlaceholder entity="blog post" />
    </AdminDetailShell>
  );
}
