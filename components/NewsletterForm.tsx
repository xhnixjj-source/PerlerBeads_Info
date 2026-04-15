"use client";

import { FormEvent, useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setDone(true);
    setEmail("");
  }

  return (
    <div>
      <p className="font-heading font-bold text-brand-text">Subscribe for weekly free patterns!</p>
      {done ? (
        <p className="mt-2 text-sm text-emerald-700">Thanks — you&apos;re on the list.</p>
      ) : (
        <form onSubmit={onSubmit} className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 rounded-full border border-ink-200/90 bg-white px-4 py-2.5 text-sm text-brand-text placeholder:text-brand-text/40 focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
          />
          <button
            type="submit"
            className="rounded-full bg-gradient-to-r from-brand-primary to-brand-coral px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
          >
            Subscribe
          </button>
        </form>
      )}
    </div>
  );
}
