import { SuppliersAdminTable } from "@/components/admin/SuppliersAdminTable";
import { loadAdminSuppliers } from "@/lib/admin/list-data";

export const dynamic = "force-dynamic";

export default async function AdminSuppliersListPage() {
  const suppliers = await loadAdminSuppliers();
  const rows = suppliers.map((s) => ({ ...s }) as Record<string, unknown>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-100">Suppliers</h1>
        <p className="mt-1 text-sm text-slate-400">Directory, verification, and supplier-facing JSON fields.</p>
      </div>
      <SuppliersAdminTable rows={rows} />
    </div>
  );
}
