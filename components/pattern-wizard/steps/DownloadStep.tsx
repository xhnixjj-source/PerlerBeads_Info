"use client";

import { useRef } from "react";
import { BeadGridCanvas } from "@/components/pattern-wizard/BeadGridCanvas";
import { buildChecklistCsv } from "@/lib/pattern-checklist-csv";
import { usePatternWizardStore } from "@/stores/pattern-wizard-store";

export function DownloadStep() {
  const gridW = usePatternWizardStore((s) => s.gridW);
  const gridH = usePatternWizardStore((s) => s.gridH);
  const activePalette = usePatternWizardStore((s) => s.activePalette);
  const cellIndices = usePatternWizardStore((s) => s.cellIndices);
  const setStep = usePatternWizardStore((s) => s.setStep);
  const resetWizard = usePatternWizardStore((s) => s.resetWizard);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cellSize = Math.min(12, Math.max(5, Math.floor(420 / Math.max(gridW, gridH))));

  const downloadPng = () => {
    const c = canvasRef.current;
    if (!c) return;
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = `perlerhub-pattern-${gridW}x${gridH}.png`;
    a.click();
  };

  const downloadCsv = () => {
    if (!cellIndices) return;
    const csv = buildChecklistCsv(cellIndices, activePalette);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `perlerhub-bead-checklist-${gridW}x${gridH}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!cellIndices) {
    return (
      <p className="text-center text-sm text-brand-text/60">
        No pattern data. Go back to generate a pattern first.
      </p>
    );
  }

  const legendMap = new Map<number, number>();
  for (let i = 0; i < cellIndices.length; i += 1) {
    const idx = cellIndices[i] ?? 0;
    legendMap.set(idx, (legendMap.get(idx) ?? 0) + 1);
  }
  const legend = Array.from(legendMap.entries()).sort((a, b) => a[0] - b[0]);

  return (
    <div className="rounded-3xl border border-ink-200/90 bg-white p-6 shadow-lg sm:p-8">
      <h2 className="font-heading text-xl font-bold text-brand-text sm:text-2xl">Your pattern is ready</h2>
      <p className="mt-2 text-sm text-brand-text/70">
        Download a PNG of the grid with color IDs, and a CSV checklist for shopping or inventory.
      </p>

      <div className="mt-8 flex justify-center overflow-x-auto rounded-2xl bg-brand-surface/80 p-4">
        <BeadGridCanvas
          ref={canvasRef}
          gridW={gridW}
          gridH={gridH}
          cellIndices={cellIndices}
          palette={activePalette}
          cellSize={cellSize}
          showLabels
        />
      </div>

      <div className="mt-8">
        <p className="text-sm font-bold text-brand-text">Color key &amp; counts</p>
        <div className="mt-3 flex max-h-48 flex-wrap gap-2 overflow-y-auto rounded-2xl border border-ink-200/80 bg-brand-surface/50 p-3">
          {legend.map(([idx, count]) => {
            const col = activePalette[idx];
            if (!col) return null;
            return (
              <div
                key={idx}
                className="flex items-center gap-2 rounded-xl border border-ink-200/80 bg-white px-2 py-1 text-xs font-semibold text-brand-text shadow-sm"
              >
                <span className="h-6 w-6 rounded-md border border-ink-200/60" style={{ backgroundColor: col.hex }} />
                <span>{col.id}</span>
                <span className="text-brand-text/55">×{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={downloadPng}
          className="rounded-full bg-gradient-to-r from-brand-primary to-brand-coral px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:brightness-105"
        >
          Download PNG
        </button>
        <button
          type="button"
          onClick={downloadCsv}
          className="rounded-full border-2 border-brand-secondary bg-white px-5 py-2.5 text-sm font-bold text-brand-secondary transition hover:bg-brand-secondary/10"
        >
          Download checklist (CSV)
        </button>
        <button
          type="button"
          onClick={() => setStep(4)}
          className="rounded-full border border-ink-200 bg-ink-50 px-5 py-2.5 text-sm font-bold text-brand-text/80 hover:bg-ink-100"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setStep(6)}
          className="rounded-full border-2 border-brand-lavender bg-white px-5 py-2.5 text-sm font-bold text-brand-primary-deep transition hover:bg-brand-mint/30"
        >
          Edit colors
        </button>
        <button
          type="button"
          onClick={() => resetWizard()}
          className="rounded-full px-5 py-2.5 text-sm font-bold text-brand-text/55 underline-offset-2 hover:text-brand-text hover:underline"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
