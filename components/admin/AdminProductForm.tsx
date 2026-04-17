"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export type CategoryOption = { id: string; name: string; slug: string };

function parseJsonField(raw: string, fallback: unknown) {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return fallback;
  }
}

export function AdminProductForm({
  categories,
  initial,
}: {
  categories: CategoryOption[];
  initial: Record<string, unknown> | null;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const cat = initial?.category as { id?: string } | undefined;

  const [slug, setSlug] = useState(String(initial?.slug ?? ""));
  const [name, setName] = useState(String(initial?.name ?? ""));
  const [categoryId, setCategoryId] = useState(String(cat?.id ?? (initial?.category_id as string) ?? categories[0]?.id ?? ""));
  const [description, setDescription] = useState(String(initial?.description ?? ""));
  const [priceUsd, setPriceUsd] = useState(
    initial?.price_usd != null && initial.price_usd !== "" ? String(initial.price_usd) : "",
  );
  const [stock, setStock] = useState(String(initial?.stock ?? 0));
  const [sku, setSku] = useState(String(initial?.sku ?? ""));
  const [featured, setFeatured] = useState(Boolean(initial?.featured));
  const [listStatus, setListStatus] = useState(String(initial?.list_status ?? "draft"));
  const [imagesJson, setImagesJson] = useState(JSON.stringify(initial?.images ?? [], null, 2));
  const [specJson, setSpecJson] = useState(JSON.stringify(initial?.specifications ?? {}, null, 2));
  const [tagsJson, setTagsJson] = useState(JSON.stringify(initial?.tags ?? [], null, 2));
  const [moq, setMoq] = useState(String(initial?.moq ?? 1));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const images = parseJsonField(imagesJson, []);
      const specifications = parseJsonField(specJson, {});
      const tags = parseJsonField(tagsJson, []);
      const body: Record<string, unknown> = {
        slug: slug.trim(),
        name: name.trim(),
        category_id: categoryId,
        description: description.trim(),
        price_usd: priceUsd.trim() === "" ? null : Number(priceUsd),
        stock: Number.parseInt(stock, 10) || 0,
        sku: sku.trim(),
        featured,
        list_status: listStatus,
        images: Array.isArray(images) ? images : [],
        specifications: typeof specifications === "object" && specifications !== null ? specifications : {},
        tags: Array.isArray(tags) ? tags : [],
        moq: Number.parseInt(moq, 10) || 1,
      };

      const url = isEdit ? `/api/admin/products/${encodeURIComponent(String(initial?.id))}` : "/api/admin/products";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { error?: { message?: string } };
      if (!res.ok) {
        setError(json.error?.message ?? "Save failed");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-300">Slug</label>
          <input
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300">SKU</label>
          <input
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300">Category</label>
        <select
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.slug})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-slate-300">Price (USD)</label>
          <input
            value={priceUsd}
            onChange={(e) => setPriceUsd(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300">Stock</label>
          <input
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300">MOQ</label>
          <input
            value={moq}
            onChange={(e) => setMoq(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-300">Listing</label>
          <select
            value={listStatus}
            onChange={(e) => setListStatus(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="flex items-end gap-2 pb-1">
          <input
            id="feat"
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-slate-500"
          />
          <label htmlFor="feat" className="text-sm text-slate-300">
            Featured
          </label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300">Images (JSON array of URLs)</label>
        <textarea
          value={imagesJson}
          onChange={(e) => setImagesJson(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300">Specifications (JSON object)</label>
        <textarea
          value={specJson}
          onChange={(e) => setSpecJson(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300">Tags (JSON array)</label>
        <textarea
          value={tagsJson}
          onChange={(e) => setTagsJson(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-100"
        />
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={loading || categories.length === 0}
        className="rounded-xl bg-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-fuchsia-500 disabled:opacity-60"
      >
        {loading ? "Saving…" : isEdit ? "Save product" : "Create product"}
      </button>
      {categories.length === 0 ? (
        <p className="text-sm text-amber-400">Create at least one category before adding products.</p>
      ) : null}
    </form>
  );
}
