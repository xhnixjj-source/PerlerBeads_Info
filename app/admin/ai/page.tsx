import { AdminAiPageTabs } from "@/components/admin/AdminAiPageTabs";
import { Suspense } from "react";

export default function AdminAiPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex max-w-4xl items-center justify-center py-16 text-slate-500">加载 AI 工具…</div>
      }
    >
      <AdminAiPageTabs />
    </Suspense>
  );
}
