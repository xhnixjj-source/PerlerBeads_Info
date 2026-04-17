"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cart-store";

type Props = {
  productId: string;
  slug: string;
  title: string;
  priceUsd: number;
  imageUrl: string | null;
  maxQty: number;
};

export function ProductAddToCart({ productId, slug, title, priceUsd, imageUrl, maxQty }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [msg, setMsg] = useState<string | null>(null);

  function onAdd() {
    setMsg(null);
    if (maxQty <= 0) {
      setMsg("Out of stock.");
      return;
    }
    addItem({ productId, slug, title, priceUsd, imageUrl, qty: 1 });
    setMsg("Added to cart.");
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-primary to-brand-coral px-6 py-3 text-sm font-bold text-white shadow-md hover:brightness-105"
      >
        Add to cart
      </button>
      {msg ? <p className="text-sm text-teal-700">{msg}</p> : null}
    </div>
  );
}
