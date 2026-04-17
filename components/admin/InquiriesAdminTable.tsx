"use client";

import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { InquiryStatusForm } from "@/components/admin/InquiryStatusForm";

type Status = "New" | "Contacted" | "Closed";

function normalizeStatus(value: unknown): Status {
  const s = String(value ?? "New");
  if (s === "New" || s === "Contacted" || s === "Closed") return s;
  return "New";
}

export function InquiriesAdminTable({ rows }: { rows: Record<string, unknown>[] }) {
  return (
    <AdminDataTable
      title="Inquiries"
      description="Buyer leads and follow-up status."
      rows={rows}
      getRowId={(r) => String(r.id ?? "")}
      exportFilename="inquiries-export"
      columns={[
        {
          key: "created_at",
          label: "Time",
          render: (r) => (r.created_at ? new Date(String(r.created_at)).toLocaleString() : "—"),
        },
        {
          key: "buyer_email",
          label: "Contact",
          render: (r) => {
            const email = String(r.buyer_email ?? r.email ?? "");
            const name = String(r.name ?? "");
            const company = String(r.company ?? "");
            const line1 = email || name || "—";
            return (
              <div>
                <p className="font-medium text-slate-100">{line1}</p>
                {company && <p className="text-xs text-slate-500">{company}</p>}
              </div>
            );
          },
        },
        {
          key: "message",
          label: "Message",
          render: (r) => {
            const msg = String(r.message ?? r.quantity ?? "");
            const short = msg.length > 120 ? `${msg.slice(0, 120)}…` : msg;
            return <span className="text-slate-300">{short || "—"}</span>;
          },
        },
        {
          key: "status",
          label: "Status",
          render: (r) => (
            <InquiryStatusForm id={String(r.id ?? "")} status={normalizeStatus(r.status)} />
          ),
        },
      ]}
      onDelete={(row) => {
        console.warn("Delete inquiry (wire API):", row.id);
      }}
    />
  );
}
