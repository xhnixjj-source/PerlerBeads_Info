"use client";

import { AdminAiImportPanel } from "@/components/admin/AdminAiImportPanel";
import { AdminAiStandalonePatternPanel } from "@/components/admin/AdminAiStandalonePatternPanel";
import { BlogAiGeneratePanel } from "@/components/admin/BlogAiGeneratePanel";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

const TAB_IDS = ["pattern", "blog", "import"] as const;
export type AdminAiTabId = (typeof TAB_IDS)[number];

function isTabId(s: string | null): s is AdminAiTabId {
  return s === "pattern" || s === "blog" || s === "import";
}

export function AdminAiPageTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: AdminAiTabId = isTabId(tabParam) ? tabParam : "pattern";

  const setTab = useCallback(
    (id: AdminAiTabId) => {
      const next = new URLSearchParams(searchParams.toString());
      next.set("tab", id);
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const tabs = useMemo(
    () =>
      [
        { id: "pattern" as const, label: "图纸分析" },
        { id: "blog" as const, label: "博客生成" },
        { id: "import" as const, label: "链接导入" },
      ] as const,
    [],
  );

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-100">AI 工具</h1>
        <p className="mt-2 text-sm text-slate-400">
          Vertex AI 能力集中入口：图纸多模态分析、SEO 博客草稿、Firecrawl 抓取与商品/博客导入（需配置
          GOOGLE_* 与 FIRECRAWL_API_KEY）。
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-700 pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === t.id
                ? "bg-gradient-to-r from-fuchsia-600/40 to-teal-600/30 text-white ring-1 ring-fuchsia-500/40"
                : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "pattern" && (
        <section className="rounded-2xl border border-slate-700 bg-slate-950/30 p-6">
          <h2 className="text-lg font-semibold text-slate-100">图纸 Vertex 分析</h2>
          <AdminAiStandalonePatternPanel />
        </section>
      )}

      {activeTab === "blog" && (
        <section className="rounded-2xl border border-slate-700 bg-slate-950/30 p-6">
          <h2 className="text-lg font-semibold text-slate-100">博客 SEO 生成</h2>
          <p className="mt-1 text-xs text-slate-500">生成后写入 draft，可在下方预览后发布或去编辑页修改。</p>
          <BlogAiGeneratePanel className="mt-4" />
        </section>
      )}

      {activeTab === "import" && (
        <section className="rounded-2xl border border-slate-700 bg-slate-950/30 p-6">
          <h2 className="text-lg font-semibold text-slate-100">链接导入</h2>
          <AdminAiImportPanel />
        </section>
      )}
    </main>
  );
}
