import { AdminDetailShell } from "@/components/admin/AdminDetailShell";
import { AdminFormPlaceholder } from "@/components/admin/AdminFormPlaceholder";
import { PatternAiAnalyzePanel } from "@/components/admin/PatternAiAnalyzePanel";
import { normalizePatternRow } from "@/lib/catalog";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPatternDetailPage({ params }: { params: { id: string } }) {
  const supabase = createSupabaseServiceClient();
  if (!supabase) notFound();

  const { data } = await supabase.from("patterns").select("*").eq("id", params.id).maybeSingle();
  if (!data) notFound();

  const p = normalizePatternRow(data as Record<string, unknown>);

  return (
    <AdminDetailShell title={p.title} subtitle={`Slug: ${p.slug}`} backHref="/admin/patterns">
      <AdminFormPlaceholder entity="pattern" />
      <PatternAiAnalyzePanel patternId={params.id} imageUrl={p.image_url} />
    </AdminDetailShell>
  );
}
