import Link from "next/link";
import { Generator } from "@/components/Generator";

export const dynamic = "force-dynamic";

export default function ImageToPatternToolPage() {
  return (
    <main className="bg-confetti min-h-[60vh]">
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <nav className="mb-6 text-sm text-brand-text/60">
          <Link href="/" className="hover:text-brand-secondary">
            Home
          </Link>{" "}
          / <span className="text-brand-text">Tools</span> /{" "}
          <span className="text-brand-text">Image to Pattern</span>
        </nav>

        <h1 className="text-center font-heading text-3xl font-extrabold tracking-tight text-brand-text sm:text-4xl">
          Image to Bead Pattern Generator
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-brand-text/75">
          Upload → tune grid &amp; palette → generate → export or shop a complete kit (checkout coming
          soon).
        </p>

        <ol className="mx-auto mt-8 max-w-2xl space-y-2 text-sm text-brand-text/85">
          <li>
            <span className="font-bold text-brand-text">1.</span> Upload image (drag-drop supported)
          </li>
          <li>
            <span className="font-bold text-brand-text">2.</span> Pick grid size, palette, brightness
            &amp; contrast
          </li>
          <li>
            <span className="font-bold text-brand-text">3.</span> Generate and compare original vs
            output
          </li>
          <li>
            <span className="font-bold text-brand-text">4.</span> Download PDF or buy a complete kit
            (placeholders until catalog + payments)
          </li>
        </ol>

        <div className="mt-10">
          <Generator variant="tool" />
        </div>
      </div>
    </main>
  );
}
