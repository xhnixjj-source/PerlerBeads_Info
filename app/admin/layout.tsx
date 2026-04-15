import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isAdminSession()) {
    redirect("/admin-auth");
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink-900">Admin Dashboard</h1>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/admin" className="text-ink-700 hover:text-ink-900">
            Overview
          </Link>
          <Link href="/admin/patterns" className="text-ink-700 hover:text-ink-900">
            Patterns
          </Link>
          <Link href="/admin/suppliers" className="text-ink-700 hover:text-ink-900">
            Suppliers
          </Link>
          <Link href="/admin/inquiries" className="text-ink-700 hover:text-ink-900">
            Inquiries
          </Link>
          <Link href="/admin/ai" className="text-ink-700 hover:text-ink-900">
            AI Tool
          </Link>
        </nav>
      </div>
      {children}
    </main>
  );
}
