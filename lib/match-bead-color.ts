import { differenceCiede2000, parse } from "culori";
import type { BeadColor } from "@/lib/bead-palettes";

const deltaE = differenceCiede2000();

/**
 * Find closest bead color using CIEDE2000 in Lab space (via culori).
 */
export function matchToPalette(rgb: { r: number; g: number; b: number }, palette: BeadColor[]): number {
  if (palette.length === 0) return 0;
  const sample = parse(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
  if (!sample) return 0;
  let bestI = 0;
  let bestD = Infinity;
  for (let i = 0; i < palette.length; i += 1) {
    const std = parse(palette[i].hex);
    if (!std) continue;
    const d = deltaE(std, sample);
    if (d < bestD) {
      bestD = d;
      bestI = i;
    }
  }
  return bestI;
}
