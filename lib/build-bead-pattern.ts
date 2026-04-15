import type { BeadColor } from "@/lib/bead-palettes";
import { matchToPalette } from "@/lib/match-bead-color";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (e) => reject(e));
    img.src = src;
  });
}

/**
 * Downsample cropped image to W×H cells (nearest center sample per cell), then match each to palette.
 */
export async function buildBeadPattern(
  croppedImageUrl: string,
  gridW: number,
  gridH: number,
  palette: BeadColor[]
): Promise<Uint16Array> {
  const img = await loadImage(croppedImageUrl);
  const canvas = document.createElement("canvas");
  canvas.width = gridW;
  canvas.height = gridH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas context");
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, gridW, gridH);
  const { data } = ctx.getImageData(0, 0, gridW, gridH);
  const total = gridW * gridH;
  const out = new Uint16Array(total);
  for (let i = 0; i < total; i += 1) {
    const o = i * 4;
    const r = data[o] ?? 0;
    const g = data[o + 1] ?? 0;
    const b = data[o + 2] ?? 0;
    out[i] = matchToPalette({ r, g, b }, palette);
  }
  return out;
}
