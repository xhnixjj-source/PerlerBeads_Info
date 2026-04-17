"use client";

import { useEffect } from "react";

type Props = {
  show: boolean;
  title: string;
  description?: string;
  variant?: "success" | "error";
  /** Called after auto-dismiss (and when user clicks close). */
  onDismiss: () => void;
  autoMs?: number;
};

export function ActionToast({
  show,
  title,
  description,
  variant = "success",
  onDismiss,
  autoMs = 5200,
}: Props) {
  useEffect(() => {
    if (!show || autoMs <= 0) return;
    const t = window.setTimeout(() => onDismiss(), autoMs);
    return () => window.clearTimeout(t);
  }, [show, autoMs, onDismiss]);

  if (!show) return null;

  const ring = variant === "success" ? "border-emerald-200/90" : "border-rose-200/90";
  const bg = variant === "success" ? "from-emerald-50 to-white" : "from-rose-50 to-white";
  const iconBg = variant === "success" ? "bg-emerald-500" : "bg-rose-500";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[120] flex justify-center p-4 sm:p-6">
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-auto flex w-full max-w-md animate-toast-in items-start gap-3 rounded-2xl border ${ring} bg-gradient-to-br ${bg} p-4 shadow-2xl shadow-ink-900/10 backdrop-blur-sm`}
      >
        <span
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconBg} text-white shadow-md`}
        >
          {variant === "success" ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          )}
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="font-heading text-sm font-bold text-ink-900">{title}</p>
          {description ? <p className="mt-1 text-sm leading-relaxed text-ink-600">{description}</p> : null}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="pointer-events-auto shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-ink-500 hover:bg-white/80 hover:text-ink-800"
        >
          Close
        </button>
      </div>
    </div>
  );
}
