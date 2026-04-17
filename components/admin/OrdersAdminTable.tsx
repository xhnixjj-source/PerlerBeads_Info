"use client";

import { AdminDataTable } from "@/components/admin/AdminDataTable";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function OrdersAdminTable({ rows }: { rows: Record<string, unknown>[] }) {
  return (
    <AdminDataTable
      title="Orders"
      description="Kit orders and fulfillment status."
      rows={rows}
      getRowId={(r) => String(r.id ?? "")}
      exportFilename="orders-export"
      filter={{
        key: "status",
        label: "Status",
        allLabel: "All statuses",
        options: STATUS_OPTIONS,
      }}
      columns={[
        {
          key: "created_at",
          label: "Created",
          render: (r) => (r.created_at ? new Date(String(r.created_at)).toLocaleString() : "—"),
        },
        { key: "order_number", label: "Order #" },
        {
          key: "status",
          label: "Status",
          render: (r) => String(r.status ?? "—"),
        },
        {
          key: "total_price",
          label: "Total",
          render: (r) => {
            const n = Number(r.total_price ?? 0);
            return Number.isFinite(n)
              ? n.toLocaleString(undefined, { style: "currency", currency: "USD" })
              : "—";
          },
        },
      ]}
    />
  );
}
