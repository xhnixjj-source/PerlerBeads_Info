"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

type Metadata = {
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  colors_required: { color_name: string; hex: string; count: number }[];
  estimated_bead_count: number;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
};

type Props = {
  patternId: string;
  imageUrl: string;
};

export function PatternAiAnalyzePanel({ patternId, imageUrl }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Metadata["difficulty"]>("beginner");
  const [colorJson, setColorJson] = useState<string>("[]");
  const [beadCount, setBeadCount] = useState<string>("0");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [seoKw, setSeoKw] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMeta, setLastMeta] = useState<Metadata | null>(null);

  const parsedColors = useMemo(() => {
    try {
      const v = JSON.parse(colorJson) as unknown;
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  }, [colorJson]);

  function applyMetadata(m: Metadata) {
    setTitle(m.title);
    setDifficulty(m.difficulty);
    setColorJson(JSON.stringify(m.colors_required ?? [], null, 2));
    setBeadCount(String(m.estimated_bead_count ?? 0));
    setSeoTitle(m.seo_title);
    setSeoDesc(m.seo_description);
    setSeoKw(m.seo_keywords);
    setLastMeta(m);
  }

  async function runAnalyze(url: string) {
    setLoading(true);
    setError(null);
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
        return;
      }
      applyMetadata(json.data.metadata as Metadata);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function onFileChange(file: File | null) {
    if (!file) return;
    setLoading(true);
    setError(null);
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
        return;
      }
      applyMetadata(json.data.metadata as Metadata);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const color_palette = parsedColors.length
        ? parsedColors
        : (lastMeta?.colors_required ?? []);
      const body: Record<string, unknown> = {
        title,
        difficulty,
        color_palette,
        seo_title: seoTitle || null,
        seo_description: seoDesc || null,
        seo_keywords: seoKw || null,
        ai_generated_metadata: {
          vertex: true,
          estimated_bead_count: Number(beadCount) || 0,
          analyzed_at: new Date().toISOString(),
        },
      };
      const res = await fetch(`/api/admin/patterns/${patternId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Save failed");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-6 space-y-4 border-t border-slate-700 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Vertex AI 分析</h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={loading || !imageUrl}
            onClick={() => void runAnalyze(imageUrl)}
            className="rounded-xl border border-fuchsia-500/50 bg-fuchsia-950/30 px-3 py-1.5 text-xs font-medium text-fuchsia-200 hover:bg-fuchsia-950/50 disabled:opacity-50"
          >
            {loading ? "分析中…" : "分析当前图片 URL"}
          </button>
          <label className="cursor-pointer rounded-xl border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800">
            上传图片并分析
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={loading}
              onChange={(e) => void onFileChange(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
      </div>
      {imageUrl && (
        <p className="break-all text-xs text-slate-500">
          当前图：<span className="text-slate-400">{imageUrl}</span>
        </p>
      )}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <form onSubmit={onSave} className="space-y-3">
        <label className="block text-sm text-slate-300">
          标题
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-slate-100"
          />
        </label>
        <label className="block text-sm text-slate-300">
          难度
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Metadata["difficulty"])}
            className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-slate-100"
          >
            <option value="beginner">beginner</option>
            <option value="intermediate">intermediate</option>
            <option value="advanced">advanced</option>
          </select>
        </label>
        <label className="block text-sm text-slate-300">
          色号 JSON（color_palette）
          <textarea
            value={colorJson}
            onChange={(e) => setColorJson(e.target.value)}
            rows={6}
            className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950/60 px-3 py-2 font-mono text-xs text-slate-100"
          />
        </label>
        <label className="block text-sm text-slate-300">
          估算豆子数（写入 ai_generated_metadata；若库表有 bead_count 可再扩展）
          <input
            value={beadCount}
            onChange={(e) => setBeadCount(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-slate-100"
          />
        </label>
        <label className="block text-sm text-slate-300">
          SEO title
          <input
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-slate-100"
          />
        </label>
        <label className="block text-sm text-slate-300">
          SEO description
          <textarea
            value={seoDesc}
            onChange={(e) => setSeoDesc(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-slate-100"
          />
        </label>
        <label className="block text-sm text-slate-300">
          SEO keywords
          <input
            value={seoKw}
            onChange={(e) => setSeoKw(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-slate-100"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
        >
          {saving ? "保存中…" : "保存到图纸"}
        </button>
      </form>
    </div>
  );
}
