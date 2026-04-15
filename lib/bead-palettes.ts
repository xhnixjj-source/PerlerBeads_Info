/**
 * Demo fuse-bead palette (IDs + hex). Kits slice this list — smaller kits = first N colors.
 * Replace with brand CSV when available.
 */
export type BeadColor = {
  id: string;
  hex: string;
};

/** Generate a spread of distinct hues for a usable demo palette. */
function makeDemoPalette(count: number): BeadColor[] {
  const out: BeadColor[] = [];
  const golden = 137.508;
  for (let i = 0; i < count; i += 1) {
    const h = (i * golden) % 360;
    const s = 55 + (i % 5) * 8;
    const l = 38 + (i % 7) * 7;
    const hex = hslToHex(h, Math.min(100, s), Math.min(92, l));
    const row = String.fromCharCode(65 + Math.floor(i / 16));
    const col = (i % 16) + 1;
    out.push({ id: `${row}${col}`, hex });
  }
  return out;
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  const R = Math.round((r + m) * 255);
  const G = Math.round((g + m) * 255);
  const B = Math.round((b + m) * 255);
  return `#${[R, G, B].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

/** Full demo palette size (acts like "all colors" in UI). */
export const DEMO_PALETTE_FULL = makeDemoPalette(72);

export type ColorKit = {
  id: string;
  label: string;
  /** Use first `limit` colors from `DEMO_PALETTE_FULL`. */
  limit: number;
};

/** Size-step kits: constrain matching to first N colors of the full list. */
export const COLOR_KITS: ColorKit[] = [
  { id: "all", label: "All colors", limit: 72 },
  { id: "k48", label: "48-color kit", limit: 48 },
  { id: "k36", label: "36-color kit", limit: 36 },
  { id: "k24", label: "24-color kit", limit: 24 },
  { id: "k12", label: "12-color kit", limit: 12 },
];

export function getPaletteForKit(kitId: string): BeadColor[] {
  const kit = COLOR_KITS.find((k) => k.id === kitId) ?? COLOR_KITS[0];
  return DEMO_PALETTE_FULL.slice(0, Math.min(kit.limit, DEMO_PALETTE_FULL.length));
}
