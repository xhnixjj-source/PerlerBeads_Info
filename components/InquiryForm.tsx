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

  const field =
    "w-full rounded-2xl border border-ink-200/90 bg-white px-4 py-3 text-brand-text outline-none transition placeholder:text-brand-text/40 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="inq-name" className="mb-1 block text-sm font-medium text-brand-text/80">
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
          className={field}
          placeholder="Your Name"
        />
      </div>
      <div>
        <label htmlFor="inq-email" className="mb-1 block text-sm font-medium text-brand-text/80">
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
          className={field}
          placeholder="Your Email"
        />
      </div>
      <div>
        <label htmlFor="inq-message" className="mb-1 block text-sm font-medium text-brand-text/80">
          Message
        </label>
        <textarea
          id="inq-message"
          name="message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${field} resize-y`}
          placeholder="Your Message"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="inq-company" className="mb-1 block text-sm font-medium text-brand-text/80">
            Company (optional)
          </label>
          <input
            id="inq-company"
            name="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={field}
            placeholder="Company name"
          />
        </div>
        <div>
          <label htmlFor="inq-quantity" className="mb-1 block text-sm font-medium text-brand-text/80">
            Quantity (optional)
          </label>
          <input
            id="inq-quantity"
            name="quantity"
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={field}
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
        className="w-full rounded-full bg-brand-secondary px-4 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-brand-secondary-deep disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : "Send Inquiry"}
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
