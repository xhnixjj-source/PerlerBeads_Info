"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  productId: string;
  slug: string;
  title: string;
  priceUsd: number;
  qty: number;
  imageUrl?: string | null;
};

type CartState = {
  items: CartLine[];
  addItem: (line: Omit<CartLine, "qty"> & { qty?: number }) => void;
  setQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  totalUsd: () => number;
  totalCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (line) => {
        const qty = Math.max(1, Math.floor(line.qty ?? 1));
        set((s) => {
          const existing = s.items.find((i) => i.productId === line.productId);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.productId === line.productId ? { ...i, qty: i.qty + qty } : i,
              ),
            };
          }
          return {
            items: [
              ...s.items,
              {
                productId: line.productId,
                slug: line.slug,
                title: line.title,
                priceUsd: line.priceUsd,
                imageUrl: line.imageUrl ?? null,
                qty,
              },
            ],
          };
        });
      },
      setQty: (productId, qty) => {
        const q = Math.max(0, Math.floor(qty));
        set((s) => ({
          items: q === 0 ? s.items.filter((i) => i.productId !== productId) : s.items.map((i) => (i.productId === productId ? { ...i, qty: q } : i)),
        }));
      },
      removeItem: (productId) => {
        set((s) => ({ items: s.items.filter((i) => i.productId !== productId) }));
      },
      clear: () => set({ items: [] }),
      totalUsd: () => get().items.reduce((sum, i) => sum + i.priceUsd * i.qty, 0),
      totalCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: "perlerhub-shop-cart-v1" },
  ),
);
