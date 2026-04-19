"use client";

import type { PatternMetadata } from "@/lib/vertex-ai/types";
import Link from "next/link";
import { FormEvent, useState } from "react";

export function AdminAiStandalonePatternPanel() {
  const [imageUrl, setImageUrl] = useState("");
  const [metadata, setMetadata] = useState<PatternMetadata | null>(null);
  const [source, setSource] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copyHint, setCopyHint] = useState<string | null>(null);

  async function runJson(url: string) {
    setLoading(true);
    setError(null);
    setCopyHint(null);
    try {
      const res = await fetch("/api/admin/ai/analyze-pattern", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Analysis failed");
        setMetadata(null);
        return;
      }
      setMetadata(json.data.metadata as PatternMetadata);
      setSource(String(json.data.source ?? "url"));
    } catch {
      setError("Network error");
      setMetadata(null);
    } finally {
      setLoading(false);
    }
  }

  async function onSubmitUrl(e: FormEvent) {
    e.preventDefault();
    const url = imageUrl.trim();
    if (!url) return;
    await runJson(url);
  }

  async function onFileChange(file: File | null) {
    if (!file) return;
    setLoading(true);
    setError(null);
    setCopyHint(null);
    const fd = new FormData();
    fd.set("file", file);
    try {
      const res = await fetch("/api/admin/ai/analyze-pattern", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Analysis failed");
        setMetadata(null);
        return;
      }
      setMetadata(json.data.metadata as PatternMetadata);
      setSource(String(json.data.source ?? "upload"));
    } catch {
      setError("Network error");
      setMetadata(null);
    } finally {
      setLoading(false);
    }
  }

  async function copyMetadata() {
    if (!metadata) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(metadata, null, 2));
      setCopyHint("已复制 JSON");
      setTimeout(() => setCopyHint(null), 2000);
    } catch {
      setCopyHint("复制失败");
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-400">
        使用 Vertex 分析公开图片 URL 或本地上传。写回图纸请在{" "}
        <Link href="/admin/patterns" className="text-teal-400 underline hover:text-teal-300">
          图纸
        </Link>{" "}
        详情页使用「Vertex AI 分析」保存。
      </p>
      <form onSubmit={onSubmitUrl} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="flex-1 rounded-xl border border-slate-600 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-fuchsia-500/60 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30"
          placeholder="图片 URL（https://…）"
        />
        <button
          type="submit"
          disabled={loading || !imageUrl.trim()}
          className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-teal-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-md hover:brightness-105 disabled:opacity-60"
        >
          {loading ? "分析中…" : "分析 URL"}
        </button>
      </form>
      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-xl border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800">
          上传图片并分析
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={loading}
            onChange={(e) => void onFileChange(e.target.files?.[0] ?? null)}
          />
        </label>
        {metadata && (
          <button
            type="button"
            onClick={() => void copyMetadata()}
            className="rounded-xl border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            复制 metadata JSON
          </button>
        )}
        {copyHint && <span className="text-xs text-teal-400">{copyHint}</span>}
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {metadata && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            来源：<span className="text-slate-400">{source}</span>
          </p>
          <dl className="grid gap-2 rounded-xl border border-slate-700 bg-slate-950/40 p-4 text-sm text-slate-200">
            <div>
              <dt className="text-xs font-medium uppercase text-slate-500">标题</dt>
              <dd>{metadata.title}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-slate-500">难度</dt>
              <dd>{metadata.difficulty}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-slate-500">标签</dt>
              <dd>{(metadata.tags ?? []).join(", ") || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-slate-500">估算豆子数</dt>
              <dd>{metadata.estimated_bead_count}</dd>
            </div>
          </dl>
          <pre className="max-h-[min(50vh,24rem)] overflow-auto rounded-2xl border border-slate-700 bg-slate-950/60 p-4 text-xs text-slate-300">
            {JSON.stringify(metadata, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
