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
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-ink-900">AI Pattern Analyzer</h1>
      <p className="mt-2 text-sm text-ink-600">
        Paste an image URL to generate title/description/tags/color summary for manual review.
      </p>
      <form onSubmit={onSubmit} className="mt-5 flex gap-3">
        <input
          type="url"
          required
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="flex-1 rounded-lg border border-ink-200 px-3 py-2"
          placeholder="https://..."
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white"
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {result && (
        <pre className="mt-6 overflow-auto rounded-2xl border border-ink-200 bg-white p-4 text-xs text-ink-700">
{JSON.stringify({ provider, result }, null, 2)}
        </pre>
      )}
    </main>
  );
}
