import type { Pattern } from "@/lib/types/pattern";

/** Number of distinct colors in the palette (wireframe: "color count"). */
export function paletteColorCount(pattern: Pattern): number {
  return Array.isArray(pattern.colors_required) ? pattern.colors_required.length : 0;
}
