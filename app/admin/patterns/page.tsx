import { PatternsAdminTable } from "@/components/admin/PatternsAdminTable";
import { loadAdminPatterns } from "@/lib/admin/list-data";

export const dynamic = "force-dynamic";

export default async function AdminPatternsListPage() {
  const patterns = await loadAdminPatterns();
  const rows = patterns.map((p) => ({ ...p }) as Record<string, unknown>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-100">Patterns</h1>
        <p className="mt-1 text-sm text-slate-400">Titles, difficulty, and bead counts.</p>
      </div>
      <PatternsAdminTable rows={rows} />
    </div>
  );
}
