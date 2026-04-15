"use client";

import { forwardRef, useEffect, useRef } from "react";
import type { BeadColor } from "@/lib/bead-palettes";

export type BeadGridCanvasProps = {
  gridW: number;
  gridH: number;
  cellIndices: Uint16Array;
  palette: BeadColor[];
  /** Base cell size in CSS pixels (before devicePixelRatio scaling). */
  cellSize: number;
  showLabels: boolean;
  onCellClick?: (index: number) => void;
  className?: string;
};

function luminance(hex: string): number {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16) / 255;
  const g = parseInt(n.slice(2, 4), 16) / 255;
  const b = parseInt(n.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export const BeadGridCanvas = forwardRef<HTMLCanvasElement, BeadGridCanvasProps>(function BeadGridCanvas(
  {
    gridW,
    gridH,
    cellIndices,
    palette,
    cellSize,
    showLabels,
    onCellClick,
    className = "",
  },
  forwardedRef
) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  function setCanvasEl(el: HTMLCanvasElement | null) {
    ref.current = el;
    if (typeof forwardedRef === "function") forwardedRef(el);
    else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLCanvasElement | null>).current = el;
  }

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);
    const w = gridW * cellSize;
    const h = gridH * cellSize;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const fontPx = Math.max(5, Math.min(14, cellSize * 0.28));

    for (let gy = 0; gy < gridH; gy += 1) {
      for (let gx = 0; gx < gridW; gx += 1) {
        const i = gy * gridW + gx;
        const idx = cellIndices[i] ?? 0;
        const col = palette[idx] ?? palette[0];
        if (!col) continue;
        const cx = gx * cellSize + cellSize / 2;
        const cy = gy * cellSize + cellSize / 2;
        const r = cellSize * 0.42;

        const grd = ctx.createRadialGradient(
          cx - r * 0.25,
          cy - r * 0.35,
          r * 0.1,
          cx,
          cy,
          r * 1.05
        );
        grd.addColorStop(0, lighten(col.hex, 0.22));
        grd.addColorStop(0.45, col.hex);
        grd.addColorStop(1, darken(col.hex, 0.18));
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.strokeStyle = "rgba(0,0,0,0.12)";
        ctx.lineWidth = Math.max(0.5, cellSize * 0.04);
        ctx.stroke();

        if (showLabels && fontPx >= 5) {
          const lum = luminance(col.hex);
          ctx.fillStyle = lum > 0.55 ? "rgba(15,18,24,0.88)" : "rgba(255,255,255,0.92)";
          ctx.font = `600 ${fontPx}px system-ui, "Segoe UI", sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(col.id, cx, cy);
        }
      }
    }
  }, [gridW, gridH, cellIndices, palette, cellSize, showLabels]);

  function onPointer(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!onCellClick || !wrapRef.current) return;
    const canvas = ref.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const gx = Math.floor(x / cellSize);
    const gy = Math.floor(y / cellSize);
    if (gx < 0 || gy < 0 || gx >= gridW || gy >= gridH) return;
    onCellClick(gy * gridW + gx);
  }

  return (
    <div ref={wrapRef} className={`inline-block overflow-auto rounded-2xl border border-ink-200/80 bg-white ${className}`}>
      <canvas
        ref={setCanvasEl}
        className={onCellClick ? "cursor-crosshair" : ""}
        onClick={onPointer}
        role="presentation"
      />
    </div>
  );
});

function lighten(hex: string, amount: number): string {
  return mixWithWhite(hex, amount);
}

function darken(hex: string, amount: number): string {
  return mixWithBlack(hex, amount);
}

function mixWithWhite(hex: string, t: number): string {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return rgbToHex(
    Math.round(r + (255 - r) * t),
    Math.round(g + (255 - g) * t),
    Math.round(b + (255 - b) * t)
  );
}

function mixWithBlack(hex: string, t: number): string {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return rgbToHex(Math.round(r * (1 - t)), Math.round(g * (1 - t)), Math.round(b * (1 - t)));
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}
