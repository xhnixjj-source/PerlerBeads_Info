import { getSuppliers } from "@/lib/catalog";

export default async function AdminSuppliersPage() {
  const suppliers = await getSuppliers();

  return (
    <section className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-ink-900">Suppliers</h2>
      <p className="mt-1 text-sm text-ink-600">Read-only list with quick quality checks.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-200 text-ink-500">
              <th className="py-2 pr-4">Company</th>
              <th className="py-2 pr-4">Location</th>
              <th className="py-2 pr-4">MOQ</th>
              <th className="py-2 pr-4">Verified</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((item) => (
              <tr key={item.id} className="border-b border-ink-100">
                <td className="py-2 pr-4 text-ink-900">{item.company_name}</td>
                <td className="py-2 pr-4 text-ink-600">{item.location}</td>
                <td className="py-2 pr-4 text-ink-600">{item.moq}</td>
                <td className="py-2 pr-4 text-ink-600">{item.is_verified ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
