"use client";

import { useEffect } from "react";
import { BeadGridCanvas } from "@/components/pattern-wizard/BeadGridCanvas";
import { usePatternWizardStore } from "@/stores/pattern-wizard-store";

export function PatternStep() {
  const step = usePatternWizardStore((s) => s.step);
  const gridW = usePatternWizardStore((s) => s.gridW);
  const gridH = usePatternWizardStore((s) => s.gridH);
  const activePalette = usePatternWizardStore((s) => s.activePalette);
  const cellIndices = usePatternWizardStore((s) => s.cellIndices);
  const patternComputing = usePatternWizardStore((s) => s.patternComputing);
  const patternError = usePatternWizardStore((s) => s.patternError);
  const computePattern = usePatternWizardStore((s) => s.computePattern);
  const setStep = usePatternWizardStore((s) => s.setStep);

  useEffect(() => {
    if (step !== 4) return;
    if (cellIndices !== null) return;
    if (patternComputing) return;
    if (patternError) return;
    void computePattern();
  }, [step, cellIndices, patternComputing, patternError, computePattern]);

  const cellSize = Math.min(14, Math.max(6, Math.floor(360 / Math.max(gridW, gridH))));

  return (
    <div className="rounded-3xl border border-ink-200/90 bg-white p-6 shadow-lg sm:p-8">
      <h2 className="font-heading text-xl font-bold text-brand-text sm:text-2xl">Build pattern</h2>
      <p className="mt-2 text-sm text-brand-text/70">
        Matching colors with CIEDE2000 in Lab space — constrained to your selected color kit.
      </p>

      {patternComputing && (
        <div className="mt-10 flex flex-col items-center justify-center gap-3 py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-lavender border-t-brand-secondary" />
          <p className="text-sm font-medium text-brand-text/70">Generating bead grid…</p>
        </div>
      )}

      {patternError && (
        <p className="mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{patternError}</p>
      )}

      {!patternComputing && cellIndices && (
        <>
          <div className="mt-8 flex justify-center overflow-x-auto">
            <BeadGridCanvas
              gridW={gridW}
              gridH={gridH}
              cellIndices={cellIndices}
              palette={activePalette}
              cellSize={cellSize}
              showLabels
            />
          </div>
          <div className="mt-8 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                usePatternWizardStore.setState({ cellIndices: null, patternError: null });
                setStep(3);
              }}
              className="rounded-full border border-ink-200 bg-ink-50 px-6 py-2.5 text-sm font-bold text-brand-text/80 transition hover:bg-ink-100"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(5)}
              className="rounded-full bg-gradient-to-r from-brand-primary to-brand-coral px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:brightness-105"
            >
              Continue to download
            </button>
          </div>
        </>
      )}
    </div>
  );
}
