"use client";

import { AdminDataTable } from "@/components/admin/AdminDataTable";

export function PatternsAdminTable({ rows }: { rows: Record<string, unknown>[] }) {
  return (
    <AdminDataTable
      title="Patterns"
      description="Bead patterns and SEO metadata."
      rows={rows}
      getRowId={(r) => String(r.id ?? "")}
      exportFilename="patterns-export"
      newItemHref="/admin/patterns/new"
      newItemLabel="New pattern"
      filter={{
        key: "difficulty",
        label: "Difficulty",
        allLabel: "All levels",
        options: [
          { value: "Beginner", label: "Beginner" },
          { value: "Intermediate", label: "Intermediate" },
          { value: "Advanced", label: "Advanced" },
        ],
      }}
      columns={[
        { key: "title", label: "Title" },
        { key: "slug", label: "Slug" },
        { key: "difficulty", label: "Difficulty" },
        {
          key: "bead_count",
          label: "Beads",
          render: (r) => String(r.bead_count ?? "—"),
        },
      ]}
      editHref={(r) => `/admin/patterns/${encodeURIComponent(String(r.id ?? ""))}`}
      onDelete={(row) => {
        console.warn("Delete pattern (wire API):", row.id);
      }}
    />
  );
}
