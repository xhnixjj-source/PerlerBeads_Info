import { SalesTrendChart } from "@/components/admin/SalesTrendChart";
import { getDashboardStats } from "@/lib/admin/dashboard-stats";
import Link from "next/link";

export const dynamic = "force-dynamic";

function fmtMoney(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-100 sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">Overview of orders, revenue, and recent activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-700/80 bg-slate-900/50 p-5 shadow-lg shadow-fuchsia-950/10">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total orders</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats.orderCount}</p>
          <Link href="/admin/orders" className="mt-3 inline-block text-sm font-medium text-teal-300 hover:underline">
            View orders →
          </Link>
        </article>
        <article className="rounded-2xl border border-slate-700/80 bg-slate-900/50 p-5 shadow-lg shadow-fuchsia-950/10">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total revenue</p>
          <p className="mt-2 text-3xl font-bold text-white">{fmtMoney(stats.revenue)}</p>
          <p className="mt-3 text-xs text-slate-500">Paid pipeline: paid, processing, shipped, completed</p>
        </article>
        <article className="rounded-2xl border border-slate-700/80 bg-slate-900/50 p-5 shadow-lg shadow-fuchsia-950/10">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">New inquiries (7d)</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats.newInquiries7d}</p>
          <Link href="/admin/inquiries" className="mt-3 inline-block text-sm font-medium text-fuchsia-300 hover:underline">
            Review →
          </Link>
        </article>
        <article className="rounded-2xl border border-slate-700/80 bg-slate-900/50 p-5 shadow-lg shadow-fuchsia-950/10">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">New suppliers (7d)</p>
          <p className="mt-2 text-3xl font-bold text-white">{stats.newSuppliers7d}</p>
          <Link href="/admin/suppliers" className="mt-3 inline-block text-sm font-medium text-amber-200/90 hover:underline">
            Directory →
          </Link>
        </article>
      </div>

      <section className="rounded-2xl border border-slate-700/80 bg-slate-900/40 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-100">Sales trend</h2>
        <div className="mt-4">
          <SalesTrendChart data={stats.salesLast7Days} />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-700/80 bg-slate-900/40 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-100">Recent orders</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-700/60">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="px-3 py-2">When</th>
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-slate-500">
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  stats.recentOrders.map((row) => {
                    const id = String(row.id ?? "");
                    const created = row.created_at ? new Date(String(row.created_at)).toLocaleString() : "—";
                    const num = String(row.order_number ?? row.id ?? "—");
                    const status = String(row.status ?? "—");
                    const total = Number(row.total_price ?? 0);
                    return (
                      <tr key={id} className="border-b border-slate-800/80 text-slate-200 last:border-0">
                        <td className="whitespace-nowrap px-3 py-2 text-slate-400">{created}</td>
                        <td className="px-3 py-2">
                          <Link href={`/admin/orders`} className="font-medium text-teal-300 hover:underline">
                            {num}
                          </Link>
                        </td>
                        <td className="px-3 py-2 capitalize text-slate-300">{status}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{fmtMoney(total)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-700/80 bg-slate-900/40 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-100">Recent inquiries</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-700/60">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400">
                  <th className="px-3 py-2">When</th>
                  <th className="px-3 py-2">Contact / message</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-3 py-6 text-center text-slate-500">
                      No inquiries yet.
                    </td>
                  </tr>
                ) : (
                  stats.recentInquiries.map((row) => {
                    const id = String(row.id ?? "");
                    const created = row.created_at ? new Date(String(row.created_at)).toLocaleString() : "—";
                    const email =
                      (row.buyer_email as string) ||
                      (row.email as string) ||
                      (row.name as string) ||
                      "—";
                    const preview =
                      (row.message as string) ||
                      (row.company as string) ||
                      (row.quantity as string) ||
                      "";
                    return (
                      <tr key={id} className="border-b border-slate-800/80 text-slate-200 last:border-0">
                        <td className="whitespace-nowrap px-3 py-2 align-top text-slate-400">{created}</td>
                        <td className="px-3 py-2 align-top">
                          <p className="font-medium text-slate-100">{email}</p>
                          {preview && <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{preview}</p>}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
