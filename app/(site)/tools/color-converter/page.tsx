import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Brand Color Converter | PerlerHub",
  description: "Map brand colors to fuse bead palettes (coming soon).",
};

export default function ColorConverterPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-ink-900">Brand Color Converter</h1>
      <p className="mt-3 text-ink-600">
        This tool will map hex/RGB brand colors to Perler, Artkal, and other standard fuse bead
        palettes with export for shopping lists.
      </p>
      <div className="mt-8 rounded-2xl border border-dashed border-ink-300 bg-ink-50 p-8 text-center">
        <p className="font-medium text-ink-800">Coming soon</p>
        <p className="mt-2 text-sm text-ink-600">
          For now, use the pattern directory and image-to-pattern tool to plan projects.
        </p>
        <Link
          href="/tools/image-to-pattern"
          className="mt-6 inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          Image to Pattern
        </Link>
      </div>
    </main>
  );
}
