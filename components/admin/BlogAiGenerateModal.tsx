"use client";

import { useState } from "react";
import { BlogAiGeneratePanel } from "@/components/admin/BlogAiGeneratePanel";

export function BlogAiGenerateModal() {
  const [open, setOpen] = useState(false);
  const [loadingBlockClose, setLoadingBlockClose] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:brightness-105"
      >
        AI 生成博客
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Close"
            onClick={() => !loadingBlockClose && setOpen(false)}
          />
          <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-[#0f1218] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-100">AI 生成 SEO 博客</h2>
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-sm text-slate-400 hover:bg-slate-800"
                onClick={() => !loadingBlockClose && setOpen(false)}
              >
                ✕
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-500">使用 Vertex AI（Gemini）生成草稿并保存为 draft。</p>

            <BlogAiGeneratePanel
              className="mt-4"
              onLoadingChange={setLoadingBlockClose}
              onAfterPublish={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
