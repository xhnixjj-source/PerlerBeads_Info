import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { InquiryStatusForm } from "@/components/admin/InquiryStatusForm";

type Inquiry = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  quantity: string | null;
  source: string;
  status: "New" | "Contacted" | "Closed";
  created_at: string;
};

async function loadInquiries() {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return [] as Inquiry[];
  const { data } = await supabase
    .from("inquiries")
    .select("id,name,email,company,quantity,source,status,created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  return (data || []) as Inquiry[];
}

export default async function AdminInquiriesPage() {
  const inquiries = await loadInquiries();

  return (
    <section className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-ink-900">Inquiries</h2>
      <p className="mt-1 text-sm text-ink-600">Track lead progress and update status.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-ink-200 text-ink-500">
              <th className="py-2 pr-3">Time</th>
              <th className="py-2 pr-3">Buyer</th>
              <th className="py-2 pr-3">Source</th>
              <th className="py-2 pr-3">Quantity</th>
              <th className="py-2 pr-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((item) => (
              <tr key={item.id} className="border-b border-ink-100 align-top">
                <td className="py-2 pr-3 text-ink-600">{new Date(item.created_at).toLocaleString()}</td>
                <td className="py-2 pr-3 text-ink-900">
                  <p>{item.name}</p>
                  <p className="text-ink-500">{item.email}</p>
                  {item.company && <p className="text-ink-500">{item.company}</p>}
                </td>
                <td className="py-2 pr-3 text-ink-600">{item.source}</td>
                <td className="py-2 pr-3 text-ink-600">{item.quantity || "-"}</td>
                <td className="py-2 pr-3">
                  <InquiryStatusForm id={item.id} status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
