"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Preview = {
  post: Record<string, unknown>;
  generated: Record<string, unknown>;
};

type Props = {
  onAfterPublish?: () => void;
  onLoadingChange?: (loading: boolean) => void;
  className?: string;
};

export function BlogAiGeneratePanel({ onAfterPublish, onLoadingChange, className }: Props) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [audience, setAudience] = useState("hobby crafters and Perler beginners");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    onLoadingChange?.(true);
    setError(null);
    setPreview(null);
    try {
      const kw = keywords
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await fetch("/api/admin/ai/generate-blog", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, keywords: kw, audience }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error?.message ?? "Request failed");
        return;
      }
      setPreview({
        post: (json.data?.post ?? {}) as Record<string, unknown>,
        generated: (json.data?.preview ?? {}) as Record<string, unknown>,
      });
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  }

  async function publish() {
    if (!preview?.post?.id) return;
    const id = String(preview.post.id);
    setLoading(true);
    onLoadingChange?.(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "published",
          published_at: new Date().toISOString(),
        }),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json?.error?.message ?? "Publish failed");
        return;
      }
      setPreview(null);
      setTopic("");
      setKeywords("");
      onAfterPublish?.();
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  }

  return (
    <div className={className}>
      {!preview ? (
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block text-sm text-slate-300">
            主题 <span className="text-red-400">*</span>
            <input
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-slate-100"
              placeholder="例如：如何挑选拼豆颜色"
            />
          </label>
          <label className="block text-sm text-slate-300">
            关键词（逗号分隔）
            <input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-slate-100"
              placeholder="perler, 拼豆, 色号"
            />
          </label>
          <label className="block text-sm text-slate-300">
            目标受众
            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-slate-100"
            />
          </label>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-teal-400 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            {loading ? "生成中…" : "生成草稿"}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-700 bg-slate-950/40 p-4 text-sm text-slate-200">
            <p className="font-medium text-teal-300">{String(preview.generated.title ?? "")}</p>
            <p className="mt-2 text-slate-400">{String(preview.generated.excerpt ?? "")}</p>
            <dl className="mt-3 grid gap-1 text-xs text-slate-500">
              <div>
                <dt className="inline font-medium text-slate-400">SEO title: </dt>
                <dd className="inline">{String(preview.generated.seo_title ?? "")}</dd>
              </div>
              <div>
                <dt className="inline font-medium text-slate-400">SEO description: </dt>
                <dd className="inline">{String(preview.generated.seo_description ?? "")}</dd>
              </div>
            </dl>
          </div>
          <details className="rounded-xl border border-slate-700 bg-slate-950/30 p-3 text-xs text-slate-400">
            <summary className="cursor-pointer text-slate-300">富文本 JSON（content）</summary>
            <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-all">
              {JSON.stringify(preview.generated.content ?? {}, null, 2)}
            </pre>
          </details>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => void publish()}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
            >
              {loading ? "发布中…" : "发布"}
            </button>
            <Link
              href={`/admin/blog/${String(preview.post.id)}`}
              className="rounded-xl border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
            >
              打开编辑页
            </Link>
            <button
              type="button"
              className="rounded-xl border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
              onClick={() => {
                setPreview(null);
                setTopic("");
                setKeywords("");
              }}
            >
              再写一篇
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
