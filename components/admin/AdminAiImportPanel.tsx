"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type CategoryRow = { id: string; name: string; slug: string };

type ScrapePreview = {
  url: string;
  markdown: string;
  metadata: Record<string, unknown>;
  links: string[];
};

export function AdminAiImportPanel() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [scrapePreview, setScrapePreview] = useState<ScrapePreview | null>(null);

  const [productUrls, setProductUrls] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productLoading, setProductLoading] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);
  const [productResult, setProductResult] = useState<string | null>(null);

  const [blogUrls, setBlogUrls] = useState("");
  const [blogKeywords, setBlogKeywords] = useState("");
  const [blogAudience, setBlogAudience] = useState("hobby crafters and Perler beginners");
  const [blogTranscript, setBlogTranscript] = useState("");
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogError, setBlogError] = useState<string | null>(null);
  const [blogResult, setBlogResult] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setCategoriesError(null);
      try {
        const res = await fetch("/api/admin/categories?limit=500&page=1", { credentials: "include" });
        const json = await res.json();
        if (!res.ok) {
          if (!cancelled) setCategoriesError(json?.error?.message ?? "Failed to load categories");
          return;
        }
        const rows = (json.data ?? []) as CategoryRow[];
        if (cancelled) return;
        setCategories(rows);
        setCategoryId((prev) => prev || (rows[0]?.id ?? ""));
      } catch {
        if (!cancelled) setCategoriesError("Network error loading categories");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onScrape(e: FormEvent) {
    e.preventDefault();
    const url = scrapeUrl.trim();
    if (!url) return;
    setScrapeLoading(true);
    setScrapeError(null);
    setScrapePreview(null);
    try {
      const res = await fetch("/api/admin/ai/scrape-url", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (!res.ok) {
        setScrapeError(json?.error?.message ?? "Scrape failed");
        return;
      }
      const d = json.data as ScrapePreview;
      setScrapePreview(d);
    } catch {
      setScrapeError("Network error");
    } finally {
      setScrapeLoading(false);
    }
  }

  function parseUrlLines(raw: string): string[] {
    return raw
      .split(/[\n\r,，;；]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  async function onImportProducts(e: FormEvent) {
    e.preventDefault();
    const urls = parseUrlLines(productUrls);
    if (!urls.length) {
      setProductError("Enter at least one URL");
      return;
    }
    if (!categoryId) {
      setProductError("Select a storefront category");
      return;
    }
    setProductLoading(true);
    setProductError(null);
    setProductResult(null);
    try {
      const res = await fetch("/api/admin/ai/import-products", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: urls.slice(0, 10), category_id: categoryId }),
      });
      const json = await res.json();
      if (!res.ok) {
        setProductError(json?.error?.message ?? "Import failed");
        return;
      }
      setProductResult(JSON.stringify(json.data?.results ?? [], null, 2));
    } catch {
      setProductError("Network error");
    } finally {
      setProductLoading(false);
    }
  }

  async function onBlogFromSources(e: FormEvent) {
    e.preventDefault();
    const urls = parseUrlLines(blogUrls);
    if (!urls.length) {
      setBlogError("Enter at least one URL");
      return;
    }
    const keywords = blogKeywords
      .split(/[,，]/)
      .map((s) => s.trim())
      .filter(Boolean);
    setBlogLoading(true);
    setBlogError(null);
    setBlogResult(null);
    try {
      const res = await fetch("/api/admin/ai/generate-blog-from-sources", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          urls: urls.slice(0, 5),
          keywords,
          audience: blogAudience.trim(),
          transcript: blogTranscript.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setBlogError(json?.error?.message ?? "Generation failed");
        return;
      }
      const post = json.data?.post as { id?: string; title?: string } | undefined;
      if (post?.id) {
        setBlogResult({ id: String(post.id), title: String(post.title ?? "") });
      }
    } catch {
      setBlogError("Network error");
    } finally {
      setBlogLoading(false);
    }
  }

  return (
    <div className="mt-4 space-y-10 text-sm text-slate-300">
      <p className="text-slate-400">
        使用 Firecrawl 抓取公开页面（需 <code className="text-fuchsia-300">FIRECRAWL_API_KEY</code>
        ）；商品/博客生成另需 Vertex。部分电商平台可能有登录墙或空正文，属正常情况。请遵守目标站点服务条款与 robots
        规则。
      </p>

      {categoriesError && <p className="text-sm text-amber-400">{categoriesError}</p>}

      <section className="space-y-3 rounded-xl border border-slate-700 bg-slate-950/20 p-4">
        <h3 className="text-base font-semibold text-slate-100">抓取预览</h3>
        <p className="text-xs text-slate-500">单次 POST，结果不入库。限流：每管理员约 30 次/分钟。</p>
        <form onSubmit={onScrape} className="flex flex-col gap-2 sm:flex-row">
          <input
            type="url"
            value={scrapeUrl}
            onChange={(e) => setScrapeUrl(e.target.value)}
            placeholder="https://…"
            className="flex-1 rounded-xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-slate-100"
          />
          <button
            type="submit"
            disabled={scrapeLoading || !scrapeUrl.trim()}
            className="rounded-xl bg-slate-700 px-4 py-2 font-medium text-white hover:bg-slate-600 disabled:opacity-50"
          >
            {scrapeLoading ? "抓取中…" : "抓取"}
          </button>
        </form>
        {scrapeError && <p className="text-sm text-red-400">{scrapeError}</p>}
        {scrapePreview && (
          <div className="space-y-2">
            <p className="text-xs text-slate-500">
              标题（metadata）：{String(scrapePreview.metadata?.title ?? "—")}
            </p>
            <details className="rounded-lg border border-slate-700 bg-slate-950/40 p-3">
              <summary className="cursor-pointer text-slate-400">Markdown 预览</summary>
              <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words text-xs text-slate-400">
                {scrapePreview.markdown.slice(0, 24_000)}
                {scrapePreview.markdown.length > 24_000 ? "\n\n… (truncated display)" : ""}
              </pre>
            </details>
          </div>
        )}
      </section>

      <section className="space-y-3 rounded-xl border border-slate-700 bg-slate-950/20 p-4">
        <h3 className="text-base font-semibold text-slate-100">商品链接导入</h3>
        <p className="text-xs text-slate-500">
          每批最多 10 条 URL（换行/逗号分隔）。写入 <code className="text-fuchsia-300">products</code>{" "}
          为 draft；图片为页面提取的 URL 字符串（可能受防盗链影响）。溯源在{" "}
          <code className="text-fuchsia-300">specifications.import</code>。
        </p>
        <label className="block text-xs text-slate-400">
          店铺类目（必填）
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-slate-100"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.slug})
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs text-slate-400">
          商品页 URL 列表
          <textarea
            value={productUrls}
            onChange={(e) => setProductUrls(e.target.value)}
            rows={5}
            placeholder={"https://example.com/a\nhttps://example.com/b"}
            className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950/60 px-3 py-2 font-mono text-xs text-slate-100"
          />
        </label>
        <form onSubmit={onImportProducts} className="space-y-2">
          {productError && <p className="text-sm text-red-400">{productError}</p>}
          <button
            type="submit"
            disabled={productLoading}
            className="rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {productLoading ? "导入中…" : "Firecrawl + Vertex 导入商品"}
          </button>
        </form>
        {productResult && (
          <pre className="max-h-48 overflow-auto rounded-lg border border-slate-700 bg-slate-950/50 p-3 text-xs text-slate-400">
            {productResult}
          </pre>
        )}
      </section>

      <section className="space-y-3 rounded-xl border border-slate-700 bg-slate-950/20 p-4">
        <h3 className="text-base font-semibold text-slate-100">基于链接素材生成博客</h3>
        <p className="text-xs text-slate-500">
          最多 5 个 URL。视频类链接可粘贴字幕/转写文本（可选）。生成一篇 draft 并记入{" "}
          <code className="text-fuchsia-300">blog_posts</code>。
        </p>
        <label className="block text-xs text-slate-400">
          文章或商品页 URL（换行/逗号）
          <textarea
            value={blogUrls}
            onChange={(e) => setBlogUrls(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950/60 px-3 py-2 font-mono text-xs text-slate-100"
          />
        </label>
        <label className="block text-xs text-slate-400">
          关键词（逗号）
          <input
            value={blogKeywords}
            onChange={(e) => setBlogKeywords(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-slate-100"
          />
        </label>
        <label className="block text-xs text-slate-400">
          受众
          <input
            value={blogAudience}
            onChange={(e) => setBlogAudience(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-slate-100"
          />
        </label>
        <label className="block text-xs text-slate-400">
          视频/音频转写（可选）
          <textarea
            value={blogTranscript}
            onChange={(e) => setBlogTranscript(e.target.value)}
            rows={4}
            placeholder="粘贴字幕或 Whisper 转写文本…"
            className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950/60 px-3 py-2 text-xs text-slate-100"
          />
        </label>
        {blogError && <p className="text-sm text-red-400">{blogError}</p>}
        <form onSubmit={onBlogFromSources}>
          <button
            type="submit"
            disabled={blogLoading}
            className="rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {blogLoading ? "生成中…" : "生成博客草稿"}
          </button>
        </form>
        {blogResult && (
          <p className="text-sm text-teal-300">
            已创建：{blogResult.title}{" "}
            <Link href={`/admin/blog/${blogResult.id}`} className="underline">
              打开编辑
            </Link>
          </p>
        )}
      </section>
    </div>
  );
}
