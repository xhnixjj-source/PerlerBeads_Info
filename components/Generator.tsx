"use client";

import { useCallback, useRef, useState } from "react";
import type { GridSize } from "@/lib/pixelate";
import { loadImageFromFile, renderPixelated } from "@/lib/pixelate";

const PIXEL_SCALE = 12;

export function Generator() {
  const [gridSize, setGridSize] = useState<GridSize>(32);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasImage, setHasImage] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const runPixelate = useCallback(async (file: File, size: GridSize) => {
    setError(null);
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const img = await loadImageFromFile(file);
      renderPixelated(img, size, canvas, PIXEL_SCALE);
      setHasImage(true);
      setFileName(file.name);
    } catch {
      setError("Could not process this image. Try PNG or JPEG.");
      setHasImage(false);
      setFileName(null);
    }
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    void runPixelate(file, gridSize);
  };

  const onGridChange = (next: GridSize) => {
    setGridSize(next);
    const input = document.getElementById("bead-file-input") as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (file) void runPixelate(file, next);
  };

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-ink-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-ink-700">
          Upload image
          <input
            id="bead-file-input"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onFileChange}
          />
        </label>

        <div className="flex items-center gap-2">
          <span className="text-sm text-ink-500">Grid</span>
          <div className="inline-flex rounded-lg border border-ink-200 p-0.5">
            {([16, 32] as const).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onGridChange(n)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  gridSize === n
                    ? "bg-ink-900 text-white"
                    : "text-ink-600 hover:bg-ink-100"
                }`}
              >
                {n}×{n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="relative mt-6 flex min-h-[220px] items-center justify-center rounded-xl bg-ink-100/80 p-4">
        <canvas
          ref={canvasRef}
          className={`max-h-[min(60vh,480px)] max-w-full border border-ink-200 bg-white shadow-inner ${
            !hasImage ? "hidden" : ""
          }`}
          style={{ imageRendering: "pixelated" }}
        />
        {!hasImage && !error && (
          <p className="text-center text-sm text-ink-400">
            Preview appears here after upload
          </p>
        )}
      </div>

      {hasImage && fileName && (
        <p className="mt-3 text-center text-xs text-ink-500">{fileName}</p>
      )}
    </div>
  );
}
