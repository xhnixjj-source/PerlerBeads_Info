import { CategoriesAdminTable } from "@/components/admin/CategoriesAdminTable";
import { loadAdminCategories } from "@/lib/admin/list-data";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const rows = await loadAdminCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-100">Categories</h1>
        <p className="mt-1 text-sm text-slate-400">Manage storefront product groups.</p>
      </div>
      <CategoriesAdminTable rows={rows} />
    </div>
  );
}
