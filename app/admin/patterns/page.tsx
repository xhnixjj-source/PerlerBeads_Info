import { getPatterns } from "@/lib/catalog";

export default async function AdminPatternsPage() {
  const patterns = await getPatterns();

  return (
    <section className="rounded-2xl border border-ink-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-ink-900">Patterns</h2>
      <p className="mt-1 text-sm text-ink-600">Read-only list for quick QA before adding editor forms.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-200 text-ink-500">
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Slug</th>
              <th className="py-2 pr-4">Difficulty</th>
              <th className="py-2 pr-4">Beads</th>
            </tr>
          </thead>
          <tbody>
            {patterns.map((item) => (
              <tr key={item.id} className="border-b border-ink-100">
                <td className="py-2 pr-4 text-ink-900">{item.title}</td>
                <td className="py-2 pr-4 text-ink-600">{item.slug}</td>
                <td className="py-2 pr-4 text-ink-600">{item.difficulty}</td>
                <td className="py-2 pr-4 text-ink-600">{item.bead_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
