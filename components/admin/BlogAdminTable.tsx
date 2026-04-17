"use client";

import { AdminDataTable } from "@/components/admin/AdminDataTable";

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
];

export function BlogAdminTable({ rows }: { rows: Record<string, unknown>[] }) {
  return (
    <AdminDataTable
      title="Blog posts"
      description="Articles and SEO fields."
      rows={rows}
      getRowId={(r) => String(r.id ?? "")}
      exportFilename="blog-posts-export"
      newItemHref="/admin/blog/new"
      newItemLabel="New post"
      filter={{
        key: "status",
        label: "Status",
        allLabel: "All",
        options: STATUS_OPTIONS,
      }}
      columns={[
        { key: "title", label: "Title" },
        { key: "slug", label: "Slug" },
        {
          key: "status",
          label: "Status",
          render: (r) => String(r.status ?? "—"),
        },
        {
          key: "published_at",
          label: "Published",
          render: (r) =>
            r.published_at ? new Date(String(r.published_at)).toLocaleString() : "—",
        },
        {
          key: "views_count",
          label: "Views",
          render: (r) => String(r.views_count ?? "0"),
        },
      ]}
      editHref={(r) => `/admin/blog/${encodeURIComponent(String(r.id ?? ""))}`}
      onDelete={(row) => {
        console.warn("Delete post (wire API):", row.id);
      }}
    />
  );
}
