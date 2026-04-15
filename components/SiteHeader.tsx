import Link from "next/link";

const navItems = [
  { href: "/patterns", label: "Patterns" },
  { href: "/suppliers", label: "Suppliers" },
  { href: "/creators", label: "Creators" },
  { href: "/tools/image-to-pattern", label: "Tools" },
  { href: "/learn", label: "Learn" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-ink-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="text-base font-bold tracking-tight text-ink-900">
          PerlerHub
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-600 transition hover:text-ink-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/wholesale"
          className="inline-flex rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white hover:bg-accent-hover sm:text-sm"
        >
          Add Listing
        </Link>
      </div>
    </header>
  );
}
