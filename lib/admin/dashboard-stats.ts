import { createSupabaseServiceClient } from "@/lib/supabase/server";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

const REVENUE_STATUSES = new Set(["paid", "processing", "shipped", "completed"]);

export type SalesDay = { date: string; total: number };

export type DashboardStats = {
  orderCount: number;
  revenue: number;
  newInquiries7d: number;
  newSuppliers7d: number;
  salesLast7Days: SalesDay[];
  recentOrders: Record<string, unknown>[];
  recentInquiries: Record<string, unknown>[];
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const empty: DashboardStats = {
    orderCount: 0,
    revenue: 0,
    newInquiries7d: 0,
    newSuppliers7d: 0,
    salesLast7Days: [],
    recentOrders: [],
    recentInquiries: [],
  };

  const supabase = createSupabaseServiceClient();
  if (!supabase) return empty;

  const now = new Date();
  const day0 = startOfDay(addDays(now, -6));

  const [ordersRes, inquiries7dRes, suppliers7dRes, ordersForChartRes] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .gte("created_at", day0.toISOString()),
    supabase
      .from("suppliers")
      .select("id", { count: "exact", head: true })
      .gte("created_at", day0.toISOString()),
    supabase
      .from("orders")
      .select("total_price,status,created_at")
      .gte("created_at", day0.toISOString()),
  ]);

  const orderCount = ordersRes.count ?? 0;

  const newInquiries7d = inquiries7dRes.count ?? 0;
  const newSuppliers7d = suppliers7dRes.count ?? 0;

  let revenue = 0;
  const revRes = await supabase
    .from("orders")
    .select("total_price,status,created_at")
    .order("created_at", { ascending: false })
    .limit(5000);
  if (!revRes.error && revRes.data) {
    for (const row of revRes.data) {
      const status = String((row as { status?: string }).status ?? "").toLowerCase();
      if (REVENUE_STATUSES.has(status)) {
        const price = Number((row as { total_price?: number }).total_price ?? 0);
        if (!Number.isNaN(price)) revenue += price;
      }
    }
  }

  const salesByDay = new Map<string, number>();
  for (let i = 0; i < 7; i++) {
    salesByDay.set(isoDate(addDays(day0, i)), 0);
  }
  if (!ordersForChartRes.error && ordersForChartRes.data) {
    for (const row of ordersForChartRes.data) {
      const status = String((row as { status?: string }).status ?? "").toLowerCase();
      if (!REVENUE_STATUSES.has(status)) continue;
      const created = (row as { created_at?: string }).created_at;
      if (!created) continue;
      const day = isoDate(new Date(created));
      if (!salesByDay.has(day)) continue;
      const price = Number((row as { total_price?: number }).total_price ?? 0);
      if (Number.isNaN(price)) continue;
      salesByDay.set(day, (salesByDay.get(day) ?? 0) + price);
    }
  }
  const salesLast7Days: SalesDay[] = Array.from(salesByDay.entries()).map(([date, total]) => ({
    date,
    total,
  }));

  const recentOrdersRes = await supabase
    .from("orders")
    .select("id,order_number,status,total_price,created_at,pattern_id")
    .order("created_at", { ascending: false })
    .limit(8);

  const recentInquiriesRes = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);

  return {
    orderCount,
    revenue,
    newInquiries7d,
    newSuppliers7d,
    salesLast7Days,
    recentOrders: (recentOrdersRes.data ?? []) as Record<string, unknown>[],
    recentInquiries: (recentInquiriesRes.data ?? []) as Record<string, unknown>[],
  };
}
