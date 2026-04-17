"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function CategoryForm({ initial }: { initial: Record<string, unknown> | null }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [name, setName] = useState(String(initial?.name ?? ""));
  const [slug, setSlug] = useState(String(initial?.slug ?? ""));
  const [description, setDescription] = useState(String(initial?.description ?? ""));
  const [sortOrder, setSortOrder] = useState(String(initial?.sort_order ?? 0));
  const [isActive, setIsActive] = useState(initial?.is_active !== false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const body = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        sort_order: Number.parseInt(sortOrder, 10) || 0,
        is_active: isActive,
      };
      const url = isEdit ? `/api/admin/categories/${encodeURIComponent(String(initial?.id))}` : "/api/admin/categories";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { error?: { message?: string }; data?: unknown };
      if (!res.ok) {
        setError(json.error?.message ?? "Save failed");
        return;
      }
      router.push("/admin/categories");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
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
        <label className="block text-sm font-medium text-slate-300">Slug</label>
        <input
          required
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-300">Sort order</label>
          <input
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-slate-100"
          />
        </div>
        <div className="flex items-end gap-2 pb-1">
          <input
            id="cat-active"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-slate-500"
          />
          <label htmlFor="cat-active" className="text-sm text-slate-300">
            Active (visible in storefront)
          </label>
        </div>
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-fuchsia-500 disabled:opacity-60"
      >
        {loading ? "Saving…" : isEdit ? "Save changes" : "Create category"}
      </button>
    </form>
  );
}
