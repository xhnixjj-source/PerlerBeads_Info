"use client";

import { useState } from "react";
import Link from "next/link";

type Source = "home" | "wholesale" | "supplier";

type Props = {
  source?: Source;
  supplierId?: string;
  /** Footer link label (default: Back to generator) */
  backLabel?: string;
};

export function InquiryForm({
  source = "home",
  supplierId,
  backLabel = "Back to generator",
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [startedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          quantity,
          message,
          source,
          supplierId,
          website,
          elapsedMs: Date.now() - startedAt,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong.");
        return;
      }
      setStatus("success");
      setName("");
      setEmail("");
      setCompany("");
      setQuantity("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="inq-name" className="mb-1 block text-sm font-medium text-ink-700">
          Name
        </label>
        <input
          id="inq-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-ink-900 outline-none ring-ink-300 placeholder:text-ink-400 focus:ring-2"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="inq-email" className="mb-1 block text-sm font-medium text-ink-700">
          Email
        </label>
        <input
          id="inq-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-ink-900 outline-none ring-ink-300 placeholder:text-ink-400 focus:ring-2"
          placeholder="you@company.com"
        />
      </div>
      <div>
        <label htmlFor="inq-message" className="mb-1 block text-sm font-medium text-ink-700">
          Message
        </label>
        <textarea
          id="inq-message"
          name="message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-y rounded-lg border border-ink-200 bg-white px-3 py-2 text-ink-900 outline-none ring-ink-300 placeholder:text-ink-400 focus:ring-2"
          placeholder="Tell us about quantity, timeline, or questions."
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="inq-company" className="mb-1 block text-sm font-medium text-ink-700">
            Company (optional)
          </label>
          <input
            id="inq-company"
            name="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-ink-900 outline-none ring-ink-300 placeholder:text-ink-400 focus:ring-2"
            placeholder="Company name"
          />
        </div>
        <div>
          <label htmlFor="inq-quantity" className="mb-1 block text-sm font-medium text-ink-700">
            Quantity (optional)
          </label>
          <input
            id="inq-quantity"
            name="quantity"
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-ink-900 outline-none ring-ink-300 placeholder:text-ink-400 focus:ring-2"
            placeholder="e.g. 200 kits"
          />
        </div>
      </div>
      <input
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        name="website"
      />

      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
      {status === "success" && (
        <p className="text-sm text-emerald-700">Thanks — we received your message.</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send inquiry"}
      </button>

      <p className="text-center text-xs text-ink-500">
        By submitting, you agree to be contacted about this inquiry.{" "}
        <Link href="/" className="text-ink-700 underline underline-offset-2">
          {backLabel}
        </Link>
      </p>
    </form>
  );
}
