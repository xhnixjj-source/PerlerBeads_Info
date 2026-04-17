import { AdminProviders } from "@/app/admin/providers";
import { AdminShell } from "@/components/admin/AdminShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "管理后台 | PerlerHub",
  description: "管理图纸、供应商、订单与内容。",
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AdminProviders>
      <AdminShell>{children}</AdminShell>
    </AdminProviders>
  );
}
