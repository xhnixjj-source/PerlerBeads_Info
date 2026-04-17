"use client";

import { useMemo } from "react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";

export function ProductsAdminTable({ rows }: { rows: Record<string, unknown>[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const r of rows) {
      const c = String(r.category ?? "").trim();
      if (c) set.add(c);
    }
    return Array.from(set)
      .sort()
      .map((value) => ({ value, label: value }));
  }, [rows]);

  return (
    <AdminDataTable
      title="Products"
      description="Wholesale SKUs linked to suppliers."
      rows={rows}
      getRowId={(r) => String(r.id ?? "")}
      exportFilename="products-export"
      newItemHref="/admin/products/new"
      newItemLabel="New product"
      filter={
        categories.length
          ? {
              key: "category",
              label: "Category",
              allLabel: "All categories",
              options: categories,
            }
          : undefined
      }
      columns={[
        { key: "name", label: "Name" },
        { key: "slug", label: "Slug" },
        { key: "category", label: "Category" },
        {
          key: "price_usd",
          label: "Price (USD)",
          render: (r) => {
            const n = r.price_usd;
            if (n == null || n === "") return "—";
            const num = Number(n);
            return Number.isFinite(num)
              ? num.toLocaleString(undefined, { style: "currency", currency: "USD" })
              : String(n);
          },
        },
        {
          key: "stock",
          label: "Stock",
          render: (r) => String(r.stock ?? "—"),
        },
      ]}
      editHref={(r) => `/admin/products/${encodeURIComponent(String(r.id ?? ""))}`}
      onDelete={(row) => {
        console.warn("Delete product (wire API):", row.id);
      }}
    />
  );
}
