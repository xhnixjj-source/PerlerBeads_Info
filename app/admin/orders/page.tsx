import { OrdersAdminTable } from "@/components/admin/OrdersAdminTable";
import { loadAdminOrders } from "@/lib/admin/list-data";

export const dynamic = "force-dynamic";

export default async function AdminOrdersListPage() {
  const orders = await loadAdminOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-100">Orders</h1>
        <p className="mt-1 text-sm text-slate-400">Order numbers, status, and totals.</p>
      </div>
      <OrdersAdminTable rows={orders} />
    </div>
  );
}
