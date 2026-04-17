"use client";

import { useSiteLocale } from "@/components/i18n/SiteLocaleProvider";
import { ActionToast } from "@/components/ui/ActionToast";
import Link from "next/link";
import { useCallback, useState } from "react";

type Source = "home" | "wholesale" | "supplier";

type Props = {
  source?: Source;
  supplierId?: string;
  /** Overrides footer link label (defaults to “back to generator” copy). */
  backLabel?: string;
};

export function InquiryForm({ source = "home", supplierId, backLabel }: Props) {
  const { messages: t } = useSiteLocale();
  const linkLabel = backLabel ?? t.inquiry.backGenerator;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [startedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastVariant, setToastVariant] = useState<"success" | "error">("success");
  const [toastTitle, setToastTitle] = useState("");
  const [toastDescription, setToastDescription] = useState<string | undefined>(undefined);

  const dismissToast = useCallback(() => setToastOpen(false), []);

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
        const msg = data.error ?? t.inquiry.genericError;
        setErrorMsg(msg);
        setToastVariant("error");
        setToastTitle(t.inquiry.toastErrSend);
        setToastDescription(msg);
        setToastOpen(true);
        return;
      }
      setStatus("success");
      setName("");
      setEmail("");
      setCompany("");
      setQuantity("");
      setMessage("");
      setToastVariant("success");
      setToastTitle(t.inquiry.toastOkTitle);
      setToastDescription(t.inquiry.toastOkDesc);
      setToastOpen(true);
    } catch {
      setStatus("error");
      setErrorMsg(t.inquiry.toastErrNet);
      setToastVariant("error");
      setToastTitle(t.inquiry.toastErrNet);
      setToastDescription(t.inquiry.genericError);
      setToastOpen(true);
    }
  }

  const field =
    "w-full rounded-2xl border border-ink-200/90 bg-white px-4 py-3 text-brand-text outline-none transition placeholder:text-brand-text/40 focus:border-brand-secondary focus:ring-2 focus:ring-brand-secondary/20";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="inq-name" className="mb-1 block text-sm font-medium text-brand-text/80">
          {t.inquiry.name}
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
          placeholder={t.inquiry.namePh}
        />
      </div>
      <div>
        <label htmlFor="inq-email" className="mb-1 block text-sm font-medium text-brand-text/80">
          {t.inquiry.email}
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
          placeholder={t.inquiry.emailPh}
        />
      </div>
      <div>
        <label htmlFor="inq-message" className="mb-1 block text-sm font-medium text-brand-text/80">
          {t.inquiry.message}
        </label>
        <textarea
          id="inq-message"
          name="message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${field} resize-y`}
          placeholder={t.inquiry.messagePh}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="inq-company" className="mb-1 block text-sm font-medium text-brand-text/80">
            {t.inquiry.company}
          </label>
          <input
            id="inq-company"
            name="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={field}
            placeholder={t.inquiry.companyPh}
          />
        </div>
        <div>
          <label htmlFor="inq-quantity" className="mb-1 block text-sm font-medium text-brand-text/80">
            {t.inquiry.quantity}
          </label>
          <input
            id="inq-quantity"
            name="quantity"
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={field}
            placeholder={t.inquiry.quantityPh}
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

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-brand-secondary px-4 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-brand-secondary-deep disabled:opacity-60"
      >
        {status === "loading" ? t.inquiry.sending : t.inquiry.send}
      </button>

      <p className="text-center text-xs text-ink-500">
        {t.inquiry.agree}{" "}
        <Link href="/" className="text-ink-700 underline underline-offset-2">
          {linkLabel}
        </Link>
      </p>

      <ActionToast
        show={toastOpen}
        variant={toastVariant}
        title={toastTitle}
        description={toastDescription}
        onDismiss={dismissToast}
      />
    </form>
  );
}
