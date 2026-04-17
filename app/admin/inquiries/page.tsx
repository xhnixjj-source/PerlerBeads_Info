import { InquiriesAdminTable } from "@/components/admin/InquiriesAdminTable";
import { loadAdminInquiries } from "@/lib/admin/list-data";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesListPage() {
  const rows = await loadAdminInquiries();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-100">Inquiries</h1>
        <p className="mt-1 text-sm text-slate-400">Leads from the site and wholesale funnel.</p>
      </div>
      <InquiriesAdminTable rows={rows} />
    </div>
  );
}
