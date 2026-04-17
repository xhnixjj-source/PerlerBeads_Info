"use client";

import { useCallback, useState } from "react";

type Props = {
  patternId: string;
  patternTitle: string;
  priceLabel?: string;
};

export function BuyKitButton({ patternId, patternTitle, priceLabel = "Buy Complete Kit - $9.99" }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const onBuy = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/orders/prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patternId }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; hint?: string };
      if (!res.ok || !data.ok) {
        setError(data.hint ? `${data.error ?? "Error"} — ${data.hint}` : (data.error ?? "Could not save order."));
        return;
      }
      setModalOpen(true);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }, [patternId]);

  return (
    <>
      <button
        type="button"
        onClick={onBuy}
        disabled={loading}
        className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Saving…" : priceLabel}
      </button>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      {modalOpen ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="prep-order-title"
            className="max-w-md rounded-2xl border border-ink-200 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-mint/60 text-2xl">
              ✓
            </div>
            <h2 id="prep-order-title" className="text-center text-lg font-bold text-ink-900">
              Order recorded
            </h2>
            <p className="mt-3 text-center text-sm leading-relaxed text-ink-600">
              Checkout system is integrating. Your order has been recorded!
            </p>
            <p className="mt-2 text-center text-xs text-ink-500 line-clamp-2">{patternTitle}</p>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="mt-6 w-full rounded-xl bg-ink-900 px-4 py-3 text-sm font-semibold text-white hover:bg-ink-800"
            >
              OK
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
