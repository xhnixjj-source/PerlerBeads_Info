"use client";

import Image from "next/image";
import { COLOR_KITS } from "@/lib/bead-palettes";
import { usePatternWizardStore } from "@/stores/pattern-wizard-store";

export function SizeStep() {
  const croppedImageUrl = usePatternWizardStore((s) => s.croppedImageUrl);
  const gridW = usePatternWizardStore((s) => s.gridW);
  const gridH = usePatternWizardStore((s) => s.gridH);
  const linkAspect = usePatternWizardStore((s) => s.linkAspect);
  const colorKitId = usePatternWizardStore((s) => s.colorKitId);
  const setGridW = usePatternWizardStore((s) => s.setGridW);
  const setGridH = usePatternWizardStore((s) => s.setGridH);
  const setLinkAspect = usePatternWizardStore((s) => s.setLinkAspect);
  const setColorKitId = usePatternWizardStore((s) => s.setColorKitId);
  const setStep = usePatternWizardStore((s) => s.setStep);

  const bump = (field: "w" | "h", delta: number) => {
    if (field === "w") setGridW(gridW + delta);
    else setGridH(gridH + delta);
  };

  const onNext = () => {
    usePatternWizardStore.setState({ cellIndices: null, patternError: null });
    setStep(4);
  };

  if (!croppedImageUrl) return null;

  return (
    <div className="rounded-3xl border border-ink-200/90 bg-white p-6 shadow-lg sm:p-8">
      <h2 className="font-heading text-xl font-bold text-brand-text sm:text-2xl">Choose pattern size</h2>
      <p className="mt-2 text-sm text-brand-text/70">
        Make sure every pixel is tightly enclosed by the grid for the best pattern results. Small border gaps are
        ignored to keep the grid clean.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <p className="text-sm font-bold text-brand-text">Preview</p>
          <p className="text-xs text-brand-text/55">
            {gridW} × {gridH} beads
          </p>
          <div className="relative mt-3 aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-ink-200/80 bg-ink-100">
            <Image src={croppedImageUrl} alt="" fill className="object-cover" unoptimized sizes="400px" />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(45,55,72,0.35) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(45,55,72,0.35) 1px, transparent 1px)
                `,
                backgroundSize: `${100 / gridW}% ${100 / gridH}%`,
              }}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-bold text-brand-text">Dimensions</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-xs font-medium text-brand-text/60">Width (beads)</span>
              <div className="flex items-center gap-1 rounded-full border border-ink-200 bg-brand-surface px-1">
                <button
                  type="button"
                  className="rounded-full px-3 py-1.5 text-lg font-bold text-brand-secondary hover:bg-white"
                  onClick={() => bump("w", -1)}
                >
                  −
                </button>
                <input
                  type="number"
                  min={4}
                  max={80}
                  value={gridW}
                  onChange={(e) => setGridW(Number(e.target.value) || 4)}
                  className="w-16 border-0 bg-transparent text-center font-heading text-lg font-bold text-brand-text focus:outline-none"
                />
                <button
                  type="button"
                  className="rounded-full px-3 py-1.5 text-lg font-bold text-brand-secondary hover:bg-white"
                  onClick={() => bump("w", 1)}
                >
                  +
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-xs font-medium text-brand-text/60">Height (beads)</span>
              {linkAspect && <span className="text-xs text-brand-secondary">(auto)</span>}
              <div className="flex items-center gap-1 rounded-full border border-ink-200 bg-brand-surface px-1">
                <button
                  type="button"
                  disabled={linkAspect}
                  className="rounded-full px-3 py-1.5 text-lg font-bold text-brand-secondary hover:bg-white disabled:opacity-30"
                  onClick={() => bump("h", -1)}
                >
                  −
                </button>
                <input
                  type="number"
                  min={4}
                  max={80}
                  disabled={linkAspect}
                  value={gridH}
                  onChange={(e) => setGridH(Number(e.target.value) || 4)}
                  className="w-16 border-0 bg-transparent text-center font-heading text-lg font-bold text-brand-text focus:outline-none disabled:opacity-50"
                />
                <button
                  type="button"
                  disabled={linkAspect}
                  className="rounded-full px-3 py-1.5 text-lg font-bold text-brand-secondary hover:bg-white disabled:opacity-30"
                  onClick={() => bump("h", 1)}
                >
                  +
                </button>
              </div>
            </div>
            <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-brand-text/80">
              <input
                type="checkbox"
                checked={linkAspect}
                onChange={(e) => setLinkAspect(e.target.checked)}
                className="h-4 w-4 rounded border-brand-lavender text-brand-secondary focus:ring-brand-secondary"
              />
              Lock square (width = height)
            </label>
          </div>

          <div>
            <p className="text-sm font-bold text-brand-text">Color kit</p>
            <p className="mt-1 text-xs text-brand-text/65">
              Choose the bead set you have. We&apos;ll only use colors from that kit.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {COLOR_KITS.map((kit) => (
                <button
                  key={kit.id}
                  type="button"
                  onClick={() => setColorKitId(kit.id)}
                  className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                    colorKitId === kit.id
                      ? "bg-gradient-to-r from-brand-primary to-brand-coral text-white shadow-sm"
                      : "border border-ink-200 bg-white text-brand-text/80 hover:border-brand-secondary/50"
                  }`}
                >
                  {kit.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="rounded-full border border-ink-200 bg-ink-50 px-6 py-2.5 text-sm font-bold text-brand-text/80 transition hover:bg-ink-100"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-full bg-gradient-to-r from-brand-primary to-brand-coral px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:brightness-105"
        >
          Next
        </button>
      </div>
    </div>
  );
}
