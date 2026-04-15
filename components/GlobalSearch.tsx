"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function GlobalSearch() {
  const [q, setQ] = useState("");
  const router = useRouter();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = q.trim();
    if (!trimmed) {
      router.push("/patterns");
      return;
    }
    router.push(`/patterns?search=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={onSubmit} className="w-full min-w-0 max-w-md flex-1">
      <label htmlFor="global-search" className="sr-only">
        Search patterns, colors, or suppliers
      </label>
      <input
        id="global-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search patterns, colors, or suppliers..."
        className="w-full rounded-full border border-brand-lavender/40 bg-white px-4 py-2.5 text-sm text-brand-text placeholder:text-brand-text/40 shadow-sm focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/25"
      />
    </form>
  );
}
