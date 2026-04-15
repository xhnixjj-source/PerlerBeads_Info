"use client";

import type { WizardStep } from "@/stores/pattern-wizard-store";

const LABELS = ["Upload", "Crop", "Size", "Pattern", "Download", "Edit"] as const;

type Props = {
  step: WizardStep;
};

export function WizardStepper({ step }: Props) {
  return (
    <nav aria-label="Pattern wizard steps" className="mb-8">
      <ol className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {LABELS.map((label, i) => {
          const n = (i + 1) as WizardStep;
          const done = step > n;
          const active = step === n;
          return (
            <li key={label} className="flex items-center gap-2 sm:gap-3">
              {i > 0 && (
                <span className="hidden h-px w-4 bg-brand-lavender/50 sm:block md:w-8" aria-hidden />
              )}
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
                    done
                      ? "bg-brand-secondary text-white"
                      : active
                        ? "bg-gradient-to-br from-brand-primary to-brand-coral text-white shadow-md ring-2 ring-brand-lavender/60"
                        : "bg-ink-100 text-brand-text/45"
                  }`}
                  aria-current={active ? "step" : undefined}
                >
                  {done ? "✓" : n}
                </span>
                <span
                  className={`hidden text-sm font-semibold sm:inline ${
                    active ? "text-brand-text" : done ? "text-brand-secondary" : "text-brand-text/45"
                  }`}
                >
                  {label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
