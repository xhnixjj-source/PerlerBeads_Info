"use client";

import { AdminDataTable } from "@/components/admin/AdminDataTable";

const STATUS_OPTIONS = [
  { value: "Pending", label: "Pending" },
  { value: "Paid", label: "Paid" },
  { value: "Shipped", label: "Shipped" },
  { value: "Delivered", label: "Delivered" },
  { value: "Canceled", label: "Canceled" },
  { value: "pending", label: "pending (legacy)" },
  { value: "paid", label: "paid (legacy)" },
  { value: "processing", label: "processing (legacy)" },
  { value: "shipped", label: "shipped (legacy)" },
  { value: "completed", label: "completed (legacy)" },
  { value: "cancelled", label: "cancelled (legacy)" },
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
