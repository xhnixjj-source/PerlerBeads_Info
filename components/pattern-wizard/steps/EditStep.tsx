"use client";

import { useRef } from "react";
import { BeadGridCanvas } from "@/components/pattern-wizard/BeadGridCanvas";
import { usePatternWizardStore } from "@/stores/pattern-wizard-store";

export function EditStep() {
  const gridW = usePatternWizardStore((s) => s.gridW);
  const gridH = usePatternWizardStore((s) => s.gridH);
  const activePalette = usePatternWizardStore((s) => s.activePalette);
  const cellIndices = usePatternWizardStore((s) => s.cellIndices);
  const editBrushIndex = usePatternWizardStore((s) => s.editBrushIndex);
  const setEditBrushIndex = usePatternWizardStore((s) => s.setEditBrushIndex);
  const editZoom = usePatternWizardStore((s) => s.editZoom);
  const setEditZoom = usePatternWizardStore((s) => s.setEditZoom);
  const applyBrush = usePatternWizardStore((s) => s.applyBrush);
  const undo = usePatternWizardStore((s) => s.undo);
  const redo = usePatternWizardStore((s) => s.redo);
  const replaceAllFromTo = usePatternWizardStore((s) => s.replaceAllFromTo);
  const setStep = usePatternWizardStore((s) => s.setStep);
  const historyIndex = usePatternWizardStore((s) => s.historyIndex);
  const history = usePatternWizardStore((s) => s.history);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const baseCell = Math.min(16, Math.max(6, Math.floor(320 / Math.max(gridW, gridH))));
  const cellSize = (baseCell * editZoom) / 100;

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const downloadPng = () => {
    const c = canvasRef.current;
    if (!c) return;
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = `perlerhub-pattern-edited-${gridW}x${gridH}.png`;
    a.click();
  };

  if (!cellIndices) {
    return <p className="text-center text-sm text-brand-text/60">Nothing to edit.</p>;
  }

  return (
    <div className="rounded-3xl border border-ink-200/90 bg-white p-6 shadow-lg sm:p-8">
      <h2 className="font-heading text-xl font-bold text-brand-text sm:text-2xl">Pattern color editor</h2>
      <p className="mt-2 text-sm text-brand-text/70">
        Pick a color below, then click beads to paint. Undo/redo and replace-all help with bulk fixes.
      </p>

      <div className="mt-6 max-h-[min(70vh,720px)] overflow-auto rounded-2xl border border-ink-200/80 bg-brand-surface/50 p-4">
        <BeadGridCanvas
          ref={canvasRef}
          gridW={gridW}
          gridH={gridH}
          cellIndices={cellIndices}
          palette={activePalette}
          cellSize={cellSize}
          showLabels
          onCellClick={(i) => applyBrush(i)}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-ink-100 pt-4">
        <span className="text-sm font-bold text-brand-text">Zoom</span>
        <button
          type="button"
          className="rounded-full border border-ink-200 px-3 py-1 text-sm font-bold text-brand-text hover:bg-white"
          onClick={() => setEditZoom(editZoom - 10)}
        >
          −
        </button>
        <span className="text-sm font-semibold text-brand-text/80">{editZoom}%</span>
        <button
          type="button"
          className="rounded-full border border-ink-200 px-3 py-1 text-sm font-bold text-brand-text hover:bg-white"
          onClick={() => setEditZoom(editZoom + 10)}
        >
          +
        </button>
        <button
          type="button"
          disabled={!canUndo}
          onClick={undo}
          className="rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-bold text-brand-text disabled:opacity-40"
        >
          Undo
        </button>
        <button
          type="button"
          disabled={!canRedo}
          onClick={redo}
          className="rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-bold text-brand-text disabled:opacity-40"
        >
          Redo
        </button>
        <button
          type="button"
          disabled={editBrushIndex < 0}
          onClick={() => {
            const from = window.prompt("Replace color ID index from (0-based in kit) — use editor pick first", "0");
            const to = window.prompt("Replace with index", "1");
            if (from !== null && to !== null) {
              replaceAllFromTo(Number(from), Number(to));
            }
          }}
          className="rounded-full border border-dashed border-brand-lavender px-4 py-2 text-sm font-bold text-brand-text/70 disabled:opacity-40"
        >
          Replace all…
        </button>
      </div>

      <div className="mt-6">
        <p className="text-sm font-bold text-brand-text">Palette (tap to select brush)</p>
        <div className="mt-3 flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-2xl border border-ink-200/80 bg-brand-mint/10 p-3">
          {activePalette.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setEditBrushIndex(i)}
              className={`flex items-center gap-1 rounded-xl border px-2 py-1 text-xs font-bold transition ${
                editBrushIndex === i
                  ? "border-brand-primary bg-white shadow-md ring-2 ring-brand-primary/40"
                  : "border-ink-200/80 bg-white hover:border-brand-secondary/50"
              }`}
            >
              <span className="h-6 w-6 rounded-md border border-ink-200/60" style={{ backgroundColor: c.hex }} />
              {c.id}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={() => setStep(5)}
          className="rounded-full border border-ink-200 bg-ink-50 px-6 py-2.5 text-sm font-bold text-brand-text/80 hover:bg-ink-100"
        >
          Back
        </button>
        <button
          type="button"
          onClick={downloadPng}
          className="rounded-full bg-gradient-to-r from-brand-primary to-brand-coral px-6 py-2.5 text-sm font-bold text-white shadow-md hover:brightness-105"
        >
          Download PNG
        </button>
      </div>
    </div>
  );
}
