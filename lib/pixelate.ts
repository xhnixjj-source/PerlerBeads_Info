/**
 * Client-only: uses HTMLCanvasElement and Image.
 * Downscales with nearest-neighbor, then upscales for display.
 */

export type GridSize = 16 | 32;

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

/**
 * Draws a pixelated (gridSize × gridSize) version of the image onto `displayCanvas`.
 * Uses "contain" to preserve aspect ratio within the square grid.
 */
export function renderPixelated(
  image: HTMLImageElement,
  gridSize: GridSize,
  displayCanvas: HTMLCanvasElement,
  pixelScale: number
): void {
  const w = gridSize;
  const h = gridSize;
  const small = document.createElement("canvas");
  small.width = w;
  small.height = h;
  const sctx = small.getContext("2d");
  if (!sctx) return;
  sctx.imageSmoothingEnabled = false;

  const iw = image.naturalWidth;
  const ih = image.naturalHeight;
  const scale = Math.min(w / iw, h / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const ox = (w - dw) / 2;
  const oy = (h - dh) / 2;
  sctx.drawImage(image, 0, 0, iw, ih, ox, oy, dw, dh);

  displayCanvas.width = w * pixelScale;
  displayCanvas.height = h * pixelScale;
  const dctx = displayCanvas.getContext("2d");
  if (!dctx) return;
  dctx.imageSmoothingEnabled = false;
  dctx.drawImage(small, 0, 0, w, h, 0, 0, displayCanvas.width, displayCanvas.height);
}
