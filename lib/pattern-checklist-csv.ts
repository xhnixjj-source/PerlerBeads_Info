import type { BeadColor } from "@/lib/bead-palettes";

export function buildChecklistCsv(cellIndices: Uint16Array, palette: BeadColor[]): string {
  const counts = new Map<number, number>();
  for (let i = 0; i < cellIndices.length; i += 1) {
    const idx = cellIndices[i] ?? 0;
    counts.set(idx, (counts.get(idx) ?? 0) + 1);
  }
  const rows: string[] = ["color_id,hex,bead_count"];
  const sorted = Array.from(counts.entries()).sort((a, b) => a[0] - b[0]);
  for (const [idx, n] of sorted) {
    const c = palette[idx];
    if (!c) continue;
    rows.push(`${c.id},${c.hex},${n}`);
  }
  return rows.join("\n");
}
