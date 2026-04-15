"use client";

import { useState } from "react";

type Props = {
  email?: string | null;
};

export function ContactMasked({ email }: Props) {
  const [open, setOpen] = useState(false);
  if (!email) {
    return <p className="text-sm text-ink-500">Contact available after inquiry.</p>;
  }
  const [local, domain] = email.includes("@") ? email.split("@") : [email, ""];
  const masked = `${local.slice(0, 2)}***@${domain || "…"}`;

  return (
    <div className="rounded-xl border border-dashed border-ink-200 bg-ink-50 p-3 text-sm">
      <p className="font-medium text-ink-800">Business contact</p>
      <p className="mt-1 text-ink-600">{open ? email : masked}</p>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-2 text-xs font-semibold text-accent hover:text-accent-hover"
        >
          Reveal full email (sign-in coming soon)
        </button>
      )}
    </div>
  );
}
