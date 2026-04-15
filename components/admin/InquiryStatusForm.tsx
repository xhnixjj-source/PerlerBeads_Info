"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "New" | "Contacted" | "Closed";

export function InquiryStatusForm({ id, status }: { id: string; status: Status }) {
  const [value, setValue] = useState<Status>(status);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function onSave() {
    setSaving(true);
    try {
      await fetch(`/api/admin/inquiries/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: value }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="inline-flex items-center gap-2">
      <select
        value={value}
        onChange={(e) => setValue(e.target.value as Status)}
        className="rounded-md border border-ink-200 bg-white px-2 py-1 text-xs"
      >
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Closed">Closed</option>
      </select>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="rounded-md bg-ink-900 px-2 py-1 text-xs text-white disabled:opacity-60"
      >
        {saving ? "..." : "Save"}
      </button>
    </div>
  );
}
