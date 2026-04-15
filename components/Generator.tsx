"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GridSize } from "@/lib/pixelate";
import { loadImageFromFile, renderPixelated } from "@/lib/pixelate";

const PIXEL_SCALE = 12;

const PALETTE_OPTIONS = [
  { id: "perler50", label: "Perler ~50", swatch: "bg-gradient-to-br from-brand-primary to-brand-yellow" },
  { id: "artkal200", label: "Artkal ~200", swatch: "bg-gradient-to-br from-brand-secondary to-emerald-400" },
  { id: "custom", label: "Custom", swatch: "border-2 border-dashed border-ink-300 bg-white" },
] as const;

function PixelHeart() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 24 24"
      className="mx-auto mb-3 drop-shadow-sm"
      aria-hidden
    >
      <defs>
        <linearGradient id="ph-heart" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF6BEB" />
          <stop offset="45%" stopColor="#FFE66D" />
          <stop offset="100%" stopColor="#4ECDC4" />
        </linearGradient>
      </defs>
      <path
        fill="url(#ph-heart)"
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      />
    </svg>
  );
}

type Variant = "tool" | "home";

type Props = {
  variant?: Variant;
};

export function Generator({ variant = "tool" }: Props) {
  const [gridSize, setGridSize] = useState<GridSize>(32);
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasImage, setHasImage] = useState(false);
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [palette, setPalette] = useState("perler50");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastFileRef = useRef<File | null>(null);

  const shell =
    variant === "home"
      ? "rounded-[1.75rem] border border-white/90 bg-white/95 p-6 shadow-2xl backdrop-blur-sm sm:p-8"
      : "rounded-[1.75rem] border border-ink-200/80 bg-white p-6 shadow-xl sm:p-8";

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const runPixelate = useCallback(async (file: File, size: GridSize) => {
    setError(null);
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
      lastFileRef.current = file;
      const img = await loadImageFromFile(file);
      renderPixelated(img, size, canvas, PIXEL_SCALE);
      setHasImage(true);
      setFileName(file.name);
    } catch {
      setError("Could not process this image. Try PNG or JPEG.");
      setHasImage(false);
      setFileName(null);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
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

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0];
      if (!file || !file.type.startsWith("image/")) {
        setError("Drop a valid image file.");
        return;
      }
      void runPixelate(file, gridSize);
    },
    [gridSize, runPixelate]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onGridChange = (next: GridSize) => {
    setGridSize(next);
    const file = lastFileRef.current;
    if (file) void runPixelate(file, next);
  };

  const onGenerateClick = () => {
    const file = lastFileRef.current;
    if (file) void runPixelate(file, gridSize);
  };

  return (
    <div className={shell}>
      {/* Upload */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="rounded-[1.5rem] border-2 border-dashed border-brand-lavender/70 bg-gradient-to-br from-white via-brand-mint/25 to-brand-yellow/20 p-8 text-center transition hover:border-brand-primary/50 md:p-10"
      >
        <PixelHeart />
        <p className="font-heading text-lg font-bold text-brand-text sm:text-xl">
          Drag &amp; Drop your bead masterpiece!
        </p>
        <p className="mt-2 text-sm text-brand-text/75">Or browse to upload — PNG, JPG, WebP</p>
        <label className="mt-5 inline-flex cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-brand-primary to-brand-coral px-8 py-3 text-sm font-bold text-white shadow-md transition hover:brightness-105">
          Browse files
          <input
            id="bead-file-input"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onFileChange}
          />
        </label>
      </div>

      <div className="mt-8 space-y-5">
        <p className="font-heading text-sm font-bold text-brand-text">Grid &amp; palette</p>
        <div className="flex flex-col gap-5 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-brand-text/80">Target grid</span>
            <div className="flex flex-wrap items-center gap-2">
              {([16, 32] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onGridChange(n)}
                  className={`rounded-full px-5 py-2.5 text-sm font-bold shadow-sm transition ${
                    gridSize === n
                      ? n === 16
                        ? "bg-pink-200 text-pink-950 ring-2 ring-pink-400"
                        : "bg-violet-200 text-violet-950 ring-2 ring-violet-400"
                      : n === 16
                        ? "bg-pink-100/90 text-pink-900 hover:bg-pink-200"
                        : "bg-violet-100/90 text-violet-900 hover:bg-violet-200"
                  }`}
                >
                  {n}×{n} Grid
                </button>
              ))}
              <button
                type="button"
                disabled
                title="Custom grid sizes — coming soon"
                className="rounded-full border-2 border-dashed border-brand-secondary/40 px-5 py-2.5 text-sm font-semibold text-brand-text/40"
              >
                Custom size
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-brand-text/80">Palette</span>
            <div className="flex flex-wrap gap-2">
              {PALETTE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  title={opt.label}
                  onClick={() => {
                    if (opt.id === "custom") return;
                    setPalette(opt.id);
                  }}
                  disabled={opt.id === "custom"}
                  className={`relative h-11 w-11 rounded-full shadow-inner transition ${
                    opt.swatch
                  } ${palette === opt.id ? "ring-2 ring-brand-text ring-offset-2" : "opacity-90 hover:opacity-100"} ${
                    opt.id === "custom" ? "cursor-not-allowed opacity-60" : ""
                  }`}
                >
                  <span className="sr-only">{opt.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-brand-text/60">
              {PALETTE_OPTIONS.find((o) => o.id === palette)?.label ?? palette} (preview label)
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="flex justify-between text-xs font-medium text-brand-text/70">
              <span>Brightness</span>
              <span>{brightness.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min={0.5}
              max={1.5}
              step={0.05}
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="mt-1 w-full accent-brand-secondary"
            />
          </div>
          <div>
            <label className="flex justify-between text-xs font-medium text-brand-text/70">
              <span>Contrast</span>
              <span>{contrast.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min={0.5}
              max={1.5}
              step={0.05}
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="mt-1 w-full accent-brand-secondary"
            />
          </div>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-8">
        <button
          type="button"
          onClick={onGenerateClick}
          disabled={!previewUrl}
          className="w-full rounded-full bg-gradient-to-r from-brand-primary via-orange-300 to-brand-coral py-3.5 text-sm font-bold text-white shadow-lg transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45"
        >
          Generate Pattern
        </button>
      </div>

      <div className="mt-8">
        <p className="mb-3 font-heading text-sm font-bold text-brand-text">Preview</p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative flex min-h-[200px] items-center justify-center rounded-2xl bg-brand-mint/20 p-3">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Original"
                className="max-h-[min(50vh,400px)] max-w-full rounded-xl object-contain"
                style={{ filter: `brightness(${brightness}) contrast(${contrast})` }}
              />
            ) : (
              <p className="text-center text-sm text-brand-text/45">Original preview</p>
            )}
          </div>
          <div className="relative flex min-h-[200px] items-center justify-center rounded-2xl bg-brand-lavender/15 p-4">
            <div
              style={{ filter: `brightness(${brightness}) contrast(${contrast})` }}
              className="inline-block"
            >
              <canvas
                ref={canvasRef}
                className={`max-h-[min(60vh,480px)] max-w-full rounded-xl border border-ink-200/80 bg-white shadow-inner ${
                  !hasImage ? "hidden" : ""
                }`}
                style={{ imageRendering: "pixelated" }}
              />
            </div>
            {!hasImage && !error && (
              <p className="absolute text-center text-sm text-brand-text/45">Bead pattern output</p>
            )}
          </div>
        </div>
        {hasImage && fileName && (
          <p className="mt-3 text-center text-xs text-brand-text/55">{fileName}</p>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-ink-100 pt-6 sm:flex-row">
        <button
          type="button"
          disabled
          className="flex-1 cursor-not-allowed rounded-full border-2 border-ink-200 bg-ink-50 px-4 py-3 text-sm font-bold text-brand-text/40"
          title="Coming soon"
        >
          Download PDF
        </button>
        <button
          type="button"
          disabled
          className="flex-1 cursor-not-allowed rounded-full bg-gradient-to-r from-brand-primary/50 to-brand-coral/50 px-4 py-3 text-sm font-bold text-white opacity-70"
          title="Connect checkout when catalog is linked"
        >
          Buy Complete Kit
        </button>
      </div>
    </div>
  );
}
