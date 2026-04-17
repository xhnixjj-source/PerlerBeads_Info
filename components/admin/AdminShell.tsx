"use client";

import { usePathname } from "next/navigation";
import { AdminChrome } from "@/components/admin/AdminChrome";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin/login")) {
    return <>{children}</>;
  }
  return <AdminChrome>{children}</AdminChrome>;
}
