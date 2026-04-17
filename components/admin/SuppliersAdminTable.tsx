"use client";

import { AdminDataTable } from "@/components/admin/AdminDataTable";

export function SuppliersAdminTable({ rows }: { rows: Record<string, unknown>[] }) {
  return (
    <AdminDataTable
      title="Suppliers"
      description="Directory entries and verification flags."
      rows={rows}
      getRowId={(r) => String(r.id ?? "")}
      exportFilename="suppliers-export"
      newItemHref="/admin/suppliers/new"
      newItemLabel="New supplier"
      columns={[
        { key: "company_name", label: "Company" },
        { key: "slug", label: "Slug" },
        { key: "location", label: "Location" },
        {
          key: "is_verified",
          label: "Verified",
          render: (r) => (r.is_verified ? "Yes" : "No"),
        },
      ]}
      editHref={(r) => `/admin/suppliers/${encodeURIComponent(String(r.id ?? ""))}`}
      onDelete={(row) => {
        console.warn("Delete supplier (wire API):", row.id);
      }}
    />
  );
}
