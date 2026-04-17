"use client";

import Link from "next/link";
import { useCartStore } from "@/stores/cart-store";

export function HeaderCartButton({ cartAria }: { cartAria: string }) {
  const count = useCartStore((s) => s.totalCount());
  const href = count > 0 ? "/checkout" : "/products";

  return (
    <Link
      href={href}
      className="relative rounded-xl p-2 text-brand-text/70 hover:bg-brand-mint/30"
      aria-label={cartAria}
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-gradient-to-r from-brand-primary to-brand-coral px-1 text-[10px] font-bold text-white">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
