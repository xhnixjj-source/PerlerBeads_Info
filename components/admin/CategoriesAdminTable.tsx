"use client";

import { AdminDataTable } from "@/components/admin/AdminDataTable";

export function CategoriesAdminTable({ rows }: { rows: Record<string, unknown>[] }) {
  return (
    <AdminDataTable
      title="Categories"
      description="Storefront navigation groups (e.g. Perler beads, wooden toys, 3D printing)."
      rows={rows}
      getRowId={(r) => String(r.id ?? "")}
      exportFilename="categories-export"
      newItemHref="/admin/categories/new"
      newItemLabel="New category"
      columns={[
        { key: "name", label: "Name" },
        { key: "slug", label: "Slug" },
        {
          key: "sort_order",
          label: "Sort",
          render: (r) => String(r.sort_order ?? "0"),
        },
        {
          key: "is_active",
          label: "Active",
          render: (r) => (r.is_active ? "Yes" : "No"),
        },
      ]}
      editHref={(r) => `/admin/categories/${encodeURIComponent(String(r.id ?? ""))}`}
    />
  );
}
