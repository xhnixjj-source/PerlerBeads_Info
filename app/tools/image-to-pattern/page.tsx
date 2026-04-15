import { Generator } from "@/components/Generator";

export const dynamic = "force-dynamic";

export default function ImageToPatternToolPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-ink-900">Image to Pattern Tool</h1>
      <p className="mt-2 text-ink-600">
        Upload an image and generate a bead-friendly pixel preview for 16x16 or 32x32 grids.
      </p>
      <div className="mt-8">
        <Generator />
      </div>
    </main>
  );
}
