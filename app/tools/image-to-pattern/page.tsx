import Link from "next/link";
import { PatternWizard } from "@/components/pattern-wizard/PatternWizard";

export const dynamic = "force-dynamic";

export default function ImageToPatternToolPage() {
  return (
    <main className="bg-confetti min-h-[60vh]">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <nav className="mb-6 text-sm text-brand-text/60">
          <Link href="/" className="hover:text-brand-secondary">
            Home
          </Link>{" "}
          / <span className="text-brand-text">Tools</span> /{" "}
          <span className="text-brand-text">Image to Pattern</span>
        </nav>

        <p className="text-center text-xs font-medium uppercase tracking-wide text-brand-secondary">
          PerlerHub
        </p>
        <h1 className="mt-1 text-center font-heading text-3xl font-extrabold tracking-tight text-brand-text sm:text-4xl">
          Fuse bead pattern generator
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-brand-text/75">
          Upload → crop → choose size &amp; color kit → we match beads (CIEDE2000) → download, then optionally
          edit colors.
        </p>

        <div className="mt-10">
          <PatternWizard />
        </div>
      </div>
    </main>
  );
}
