"use client";

import { FormEvent, useState } from "react";

type AnalyzeResult = {
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  colors_required: { color_name: string; hex: string; count: number }[];
};

export default function AdminAiPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [provider, setProvider] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/analyze-pattern", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      const data = await res.json();
      setResult(data.result || null);
      setProvider(data.provider || "");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl">
      <h1 className="font-heading text-2xl font-bold text-slate-100">AI pattern analyzer</h1>
      <p className="mt-2 text-sm text-slate-400">
        Paste an image URL to generate title, description, tags, and color summary for manual review.
      </p>
      <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="url"
          required
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="flex-1 rounded-xl border border-slate-600 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-fuchsia-500/60 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30"
          placeholder="https://..."
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-teal-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-md hover:brightness-105 disabled:opacity-60"
        >
          {loading ? "Analyzing…" : "Analyze"}
        </button>
      </form>

      {result && (
        <pre className="mt-6 max-h-[min(70vh,32rem)] overflow-auto rounded-2xl border border-slate-700 bg-slate-950/60 p-4 text-xs text-slate-300">
          {JSON.stringify({ provider, result }, null, 2)}
        </pre>
      )}
    </main>
  );
}
