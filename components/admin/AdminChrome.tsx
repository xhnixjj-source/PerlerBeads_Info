"use client";

import { adminNavHrefsForRole } from "@/lib/admin/permissions";
import type { AdminRole } from "@/lib/admin/permissions";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useMemo, useState } from "react";

const nav = [
  { href: "/admin/dashboard", label: "控制台" },
  { href: "/admin/suppliers", label: "供应商" },
  { href: "/admin/products", label: "商品" },
  { href: "/admin/patterns", label: "图纸" },
  { href: "/admin/orders", label: "订单" },
  { href: "/admin/inquiries", label: "询盘" },
  { href: "/admin/blog", label: "博客" },
  { href: "/admin/ai", label: "AI 工具" },
  { href: "/admin/settings", label: "设置" },
  { href: "/admin/users", label: "用户" },
];

function NavLinks({
  onNavigate,
  pathname,
  allowed,
}: {
  onNavigate?: () => void;
  pathname: string | null;
  allowed: Set<string>;
}) {
  return (
    <ul className="space-y-1">
      {nav
        .filter((item) => allowed.has(item.href))
        .map((item) => {
        const active =
          pathname === item.href ||
          (item.href === "/admin/dashboard" && (pathname === "/admin" || pathname === "/admin/dashboard")) ||
          (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href + "/"));
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "border-l-4 border-fuchsia-400 bg-slate-800/90 text-white shadow-inner shadow-fuchsia-900/20"
                  : "border-l-4 border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function AdminChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const role = session?.user?.role as AdminRole | undefined;
  const allowed = useMemo(() => {
    if (status === "loading" || !role) {
      return new Set<string>(["/admin/dashboard"]);
    }
    return adminNavHrefsForRole(role);
  }, [status, role]);

  async function logout() {
    setLoggingOut(true);
    try {
      await signOut({ callbackUrl: "/admin/login" });
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0b0e14] text-slate-100">
      <div
        className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition lg:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-800 bg-[#0f1218] shadow-2xl transition-transform duration-200 lg:static lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="border-b border-slate-800 px-4 py-5">
          <Link href="/admin/dashboard" className="font-heading text-lg font-bold tracking-tight text-white">
            PerlerHub <span className="text-fuchsia-400">Admin</span>
          </Link>
          <div className="mt-2 h-1 w-full rounded-full bg-gradient-to-r from-fuchsia-500 via-amber-300 to-teal-400" />
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <NavLinks
            pathname={pathname}
            onNavigate={() => setMenuOpen(false)}
            allowed={allowed}
          />
        </nav>
        <div className="border-t border-slate-800 p-4">
          <Link href="/" className="text-xs font-medium text-slate-500 hover:text-fuchsia-300">
            ← 返回网站
          </Link>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-800 bg-[#0b0e14]/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex rounded-xl border border-slate-700 p-2 text-slate-200 hover:bg-slate-800 lg:hidden"
              aria-label="打开菜单"
              onClick={() => setMenuOpen(true)}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <p className="text-sm text-slate-400">
              当前登录{" "}
              <span className="font-medium text-slate-200">
                {status === "loading" ? "…" : session?.user?.email ?? "管理员"}
              </span>
              {role && (
                <span className="ml-2 rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                  {role.replace(/_/g, " ")}
                </span>
              )}
            </p>
          </div>
          <button
            type="button"
            disabled={loggingOut}
            onClick={() => void logout()}
            className="rounded-xl border border-slate-600 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 disabled:opacity-50"
          >
            {loggingOut ? "正在退出…" : "退出登录"}
          </button>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
