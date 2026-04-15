import type { Area } from "react-easy-crop";
import { create } from "zustand";
import type { BeadColor } from "@/lib/bead-palettes";
import { getPaletteForKit } from "@/lib/bead-palettes";
import { buildBeadPattern } from "@/lib/build-bead-pattern";

/** 1–6: Upload, Crop, Size, Pattern, Download, Edit */
export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;

const MAX_GRID = 80;
const MAX_FILE_MB = 5;

type State = {
  step: WizardStep;
  file: File | null;
  imageSrc: string | null;
  crop: { x: number; y: number };
  zoom: number;
  aspect: number;
  croppedAreaPixels: Area | null;
  /** Blob URL after crop — revoke on reset */
  croppedImageUrl: string | null;
  gridW: number;
  gridH: number;
  linkAspect: boolean;
  colorKitId: string;
  activePalette: BeadColor[];
  cellIndices: Uint16Array | null;
  patternComputing: boolean;
  patternError: string | null;
  editBrushIndex: number;
  editZoom: number;
  history: Uint16Array[];
  historyIndex: number;
};

type Actions = {
  setStep: (s: WizardStep) => void;
  setFile: (file: File | null) => void;
  setImageSrc: (url: string | null) => void;
  setCropState: (p: Partial<Pick<State, "crop" | "zoom" | "aspect" | "croppedAreaPixels">>) => void;
  setCroppedImageUrl: (url: string | null) => void;
  setGridW: (w: number) => void;
  setGridH: (h: number) => void;
  setLinkAspect: (v: boolean) => void;
  setColorKitId: (id: string) => void;
  setEditBrushIndex: (i: number) => void;
  setEditZoom: (z: number) => void;
  computePattern: () => Promise<void>;
  applyBrush: (cellIndex: number) => void;
  undo: () => void;
  redo: () => void;
  replaceAllFromTo: (fromIdx: number, toIdx: number) => void;
  resetWizard: () => void;
};

const initialCrop = { x: 0, y: 0 };

function clampGrid(n: number): number {
  return Math.min(MAX_GRID, Math.max(4, Math.round(n)));
}

const initialPalette = getPaletteForKit("all");

export const usePatternWizardStore = create<State & Actions>((set, get) => ({
  step: 1,
  file: null,
  imageSrc: null,
  crop: initialCrop,
  zoom: 1,
  aspect: 1,
  croppedAreaPixels: null,
  croppedImageUrl: null,
  gridW: 29,
  gridH: 29,
  linkAspect: true,
  colorKitId: "all",
  activePalette: initialPalette,
  cellIndices: null,
  patternComputing: false,
  patternError: null,
  editBrushIndex: 0,
  editZoom: 100,
  history: [],
  historyIndex: -1,

  setStep: (s) => set({ step: s }),
  setFile: (file) => set({ file }),
  setImageSrc: (imageSrc) => set({ imageSrc }),
  setCropState: (p) => set(p),
  setCroppedImageUrl: (croppedImageUrl) => set({ croppedImageUrl }),
  setGridW: (w) => {
    const gw = clampGrid(w);
    const { linkAspect, gridH } = get();
    if (linkAspect) {
      set({ gridW: gw, gridH: gw });
    } else {
      set({ gridW: gw });
    }
  },
  setGridH: (h) => {
    const gh = clampGrid(h);
    const { linkAspect, gridW } = get();
    if (linkAspect) {
      set({ gridH: gh, gridW: gh });
    } else {
      set({ gridH: gh });
    }
  },
  setLinkAspect: (linkAspect) => {
    if (linkAspect) {
      const { gridW } = get();
      const g = clampGrid(gridW);
      set({ linkAspect: true, gridH: g, gridW: g });
    } else {
      set({ linkAspect: false });
    }
  },
  setColorKitId: (colorKitId) => {
    const activePalette = getPaletteForKit(colorKitId);
    set({ colorKitId, activePalette, editBrushIndex: 0 });
  },
  setEditBrushIndex: (editBrushIndex) => set({ editBrushIndex }),
  setEditZoom: (editZoom) => set({ editZoom: Math.min(200, Math.max(40, editZoom)) }),

  computePattern: async () => {
    const { croppedImageUrl, gridW, gridH, activePalette } = get();
    if (!croppedImageUrl) {
      set({ patternError: "Missing cropped image." });
      return;
    }
    set({ patternComputing: true, patternError: null });
    try {
      const cellIndices = await buildBeadPattern(croppedImageUrl, gridW, gridH, activePalette);
      set({
        cellIndices,
        patternComputing: false,
        history: [new Uint16Array(cellIndices)],
        historyIndex: 0,
      });
    } catch (e) {
      set({
        patternComputing: false,
        patternError: e instanceof Error ? e.message : "Pattern failed.",
      });
    }
  },

  applyBrush: (cellIndex) => {
    const { cellIndices, editBrushIndex, activePalette, history, historyIndex } = get();
    if (!cellIndices || cellIndex < 0 || cellIndex >= cellIndices.length) return;
    if (editBrushIndex < 0 || editBrushIndex >= activePalette.length) return;
    if (cellIndices[cellIndex] === editBrushIndex) return;
    const next = new Uint16Array(cellIndices);
    next[cellIndex] = editBrushIndex;
    const h = history.slice(0, historyIndex + 1);
    h.push(next);
    set({ cellIndices: next, history: h, historyIndex: h.length - 1 });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const i = historyIndex - 1;
    const cellIndices = new Uint16Array(history[i]!);
    set({ historyIndex: i, cellIndices });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const i = historyIndex + 1;
    const cellIndices = new Uint16Array(history[i]!);
    set({ historyIndex: i, cellIndices });
  },

  replaceAllFromTo: (fromIdx, toIdx) => {
    const { cellIndices, activePalette, history, historyIndex } = get();
    if (!cellIndices) return;
    if (fromIdx < 0 || toIdx < 0 || fromIdx >= activePalette.length || toIdx >= activePalette.length)
      return;
    const next = new Uint16Array(cellIndices);
    for (let i = 0; i < next.length; i += 1) {
      if (next[i] === fromIdx) next[i] = toIdx;
    }
    const h = history.slice(0, historyIndex + 1);
    h.push(next);
    set({ cellIndices: next, history: h, historyIndex: h.length - 1 });
  },

  resetWizard: () => {
    const s = get();
    if (s.imageSrc) URL.revokeObjectURL(s.imageSrc);
    if (s.croppedImageUrl) URL.revokeObjectURL(s.croppedImageUrl);
    set({
      step: 1,
      file: null,
      imageSrc: null,
      crop: initialCrop,
      zoom: 1,
      aspect: 1,
      croppedAreaPixels: null,
      croppedImageUrl: null,
      gridW: 29,
      gridH: 29,
      linkAspect: true,
      colorKitId: "all",
      activePalette: getPaletteForKit("all"),
      cellIndices: null,
      patternComputing: false,
      patternError: null,
      editBrushIndex: 0,
      editZoom: 100,
      history: [],
      historyIndex: -1,
    });
  },
}));

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) return "Please use PNG, JPG, or WEBP.";
  if (file.size > MAX_FILE_MB * 1024 * 1024) return `File must be ${MAX_FILE_MB} MB or smaller.`;
  return null;
}

export { MAX_FILE_MB, MAX_GRID };
