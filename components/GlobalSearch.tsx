"use client";

import { useSiteLocale } from "@/components/i18n/SiteLocaleProvider";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function GlobalSearch() {
  const { messages: m } = useSiteLocale();
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
        {m.search.label}
      </label>
      <input
        id="global-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={m.search.placeholder}
        className="w-full rounded-full border border-brand-lavender/40 bg-white px-4 py-2.5 text-sm text-brand-text placeholder:text-brand-text/40 shadow-sm focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/25"
      />
    </form>
  );
}
