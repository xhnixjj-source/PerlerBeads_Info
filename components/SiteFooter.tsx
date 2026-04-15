import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-14 border-t border-ink-200 bg-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 text-sm sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-semibold text-ink-900">PerlerHub</p>
          <p className="mt-2 text-ink-600">
            Directory and tooling for bead pattern lovers and global buyers.
          </p>
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-ink-900">Quick links</p>
          <Link className="block text-ink-600 hover:text-ink-900" href="/patterns">
            Pattern directory
          </Link>
          <Link className="block text-ink-600 hover:text-ink-900" href="/suppliers">
            Supplier directory
          </Link>
          <Link className="block text-ink-600 hover:text-ink-900" href="/tools/image-to-pattern">
            Image converter
          </Link>
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-ink-900">Legal</p>
          <p className="text-ink-600">Terms of Service</p>
          <p className="text-ink-600">Privacy Policy</p>
          <p className="text-xs text-ink-500">Not affiliated with any bead brand.</p>
        </div>
      </div>
    </footer>
  );
}
