"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { useCartStore } from "@/stores/cart-store";

export function CheckoutClient() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const totalUsd = useCartStore((s) => s.totalUsd());
  const clear = useCartStore((s) => s.clear);

  const [fullName, setFullName] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const payloadItems = useMemo(
    () =>
      items.map((i) => ({
        productId: i.productId,
        qty: i.qty,
        unitPriceUsd: i.priceUsd,
      })),
    [items],
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: payloadItems,
          shipping: { fullName, line1, city, postalCode, country, email },
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; orderId?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Checkout failed");
        return;
      }
      clear();
      router.push(`/checkout/success?orderId=${encodeURIComponent(data.orderId ?? "")}`);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-white p-8 text-center shadow-sm">
        <p className="text-ink-700">Your cart is empty.</p>
        <Link href="/products" className="mt-4 inline-block font-semibold text-brand-secondary hover:underline">
          Browse the store
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-bold text-ink-900">Order summary</h2>
        <ul className="mt-4 divide-y divide-ink-100">
          {items.map((i) => (
            <li key={i.productId} className="flex justify-between gap-4 py-3 text-sm">
              <span>
                {i.title} × {i.qty}
              </span>
              <span className="font-medium text-ink-900">
                {(i.priceUsd * i.qty).toLocaleString(undefined, { style: "currency", currency: "USD" })}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between border-t border-ink-200 pt-4 text-base font-bold text-ink-900">
          <span>Total</span>
          <span>{totalUsd.toLocaleString(undefined, { style: "currency", currency: "USD" })}</span>
        </p>
        <p className="mt-3 text-xs text-ink-500">Payment is simulated — your card is not charged.</p>
      </div>

      <form onSubmit={(e) => void onSubmit(e)} className="space-y-4 rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
        <h2 className="font-heading text-lg font-bold text-ink-900">Shipping</h2>
        <div>
          <label className="block text-sm font-medium text-ink-700">Full name</label>
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-ink-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700">Address line</label>
          <input
            required
            value={line1}
            onChange={(e) => setLine1(e.target.value)}
            className="mt-1 w-full rounded-xl border border-ink-200 px-3 py-2 text-sm"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-ink-700">City</label>
            <input
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700">Postal code</label>
            <input
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700">Country</label>
          <input
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mt-1 w-full rounded-xl border border-ink-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700">Email (optional)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-ink-200 px-3 py-2 text-sm"
          />
        </div>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-brand-primary to-brand-coral px-4 py-3 text-sm font-bold text-white shadow-md hover:brightness-105 disabled:opacity-60"
        >
          {loading ? "Processing…" : "Pay now (simulated)"}
        </button>
      </form>
    </div>
  );
}
