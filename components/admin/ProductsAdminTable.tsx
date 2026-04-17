"use client";

import { useMemo } from "react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";

export function ProductsAdminTable({ rows }: { rows: Record<string, unknown>[] }) {
  const categories = useMemo(() => {
    const map = new Map<string, string>();
    for (const r of rows) {
      const slug = String(r.category_slug ?? "").trim();
      const name = String(r.category_name ?? "").trim();
      if (slug) map.set(slug, name || slug);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([value, label]) => ({ value, label }));
  }, [rows]);

  return (
    <AdminDataTable
      title="Products"
      description="Store SKUs, categories, and inventory."
      rows={rows}
      getRowId={(r) => String(r.id ?? "")}
      exportFilename="products-export"
      newItemHref="/admin/products/new"
      newItemLabel="New product"
      filter={
        categories.length
          ? {
              key: "category_slug",
              label: "Category",
              allLabel: "All categories",
              options: categories,
            }
          : undefined
      }
      columns={[
        { key: "name", label: "Name" },
        { key: "slug", label: "Slug" },
        { key: "category_name", label: "Category" },
        {
          key: "list_status",
          label: "Listing",
          render: (r) => String(r.list_status ?? "—"),
        },
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
