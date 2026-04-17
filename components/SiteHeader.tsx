import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { GlobalSearch } from "@/components/GlobalSearch";
import { NavDropdown } from "@/components/NavDropdown";
import { PerlerHubLogo } from "@/components/PerlerHubLogo";
import type { Messages } from "@/messages";

export function SiteHeader({ messages: m }: { messages: Messages }) {
  const patternsItems = [
    { label: m.nav.patternsAll, href: "/patterns" },
    { label: m.nav.patternsAnime, href: "/patterns?tag=anime" },
    { label: m.nav.patternsGames, href: "/patterns?tag=games" },
    { label: m.nav.patternsHolidays, href: "/patterns?tag=holidays" },
    { label: m.nav.patterns3d, href: "/patterns?tag=3d" },
    { label: m.nav.patternsAnimals, href: "/patterns?tag=animals" },
  ];

  const toolsItems = [
    { label: m.nav.toolsImage, href: "/tools/image-to-pattern" },
    { label: m.nav.toolsColor, href: "/tools/color-converter" },
  ];

  return (
    <header className="border-b border-ink-200/90 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <div className="flex items-center justify-between gap-4">
            <PerlerHubLogo />
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                href="#cart"
                className="relative rounded-xl p-2 text-brand-text/70 hover:bg-brand-mint/30"
                aria-label={m.nav.cartAria}
              >
                <CartIcon />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-gradient-to-r from-brand-primary to-brand-coral px-1 text-[10px] font-bold text-white">
                  0
                </span>
              </Link>
            </div>
          </div>

          <nav className="hidden flex-wrap items-center justify-center gap-x-0.5 gap-y-2 lg:flex">
            <Link
              href="/"
              className="rounded-lg px-2.5 py-1.5 text-sm font-semibold text-emerald-600 hover:bg-brand-mint/20"
            >
              {m.nav.home}
            </Link>
            <Link
              href="/suppliers"
              className="rounded-lg px-2.5 py-1.5 text-sm font-semibold text-rose-500 hover:bg-rose-50"
            >
              {m.nav.directory}
            </Link>
            <NavDropdown label={m.nav.patterns} items={patternsItems} summaryClassName="text-orange-500" />
            <Link
              href="/creators"
              className="rounded-lg px-2.5 py-1.5 text-sm font-semibold text-violet-600 hover:bg-violet-50"
            >
              {m.nav.community}
            </Link>
            <Link
              href="/learn"
              className="rounded-lg px-2.5 py-1.5 text-sm font-semibold text-sky-600 hover:bg-sky-50"
            >
              {m.nav.blog}
            </Link>
            <NavDropdown label={m.nav.tools} items={toolsItems} summaryClassName="text-amber-600" />
            <Link
              href="/#quick-inquiry"
              className="rounded-lg px-2.5 py-1.5 text-sm font-semibold text-brand-secondary hover:bg-brand-secondary/10"
            >
              {m.nav.contact}
            </Link>
          </nav>

          <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:max-w-xl">
            <GlobalSearch />
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
              <LanguageSwitcher />
              <Link
                href="#cart"
                className="relative hidden rounded-xl p-2 text-brand-text/70 hover:bg-brand-mint/30 lg:inline-flex"
                aria-label={m.nav.cartAria}
              >
                <CartIcon />
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-gradient-to-r from-brand-primary to-brand-coral px-1 text-[10px] font-bold text-white">
                  0
                </span>
              </Link>
              <Link href="#sign-in" className="text-sm font-medium text-brand-text/70 hover:text-brand-text">
                {m.nav.signIn}
              </Link>
              <Link
                href="#sign-up"
                className="text-sm font-medium text-brand-secondary hover:text-brand-secondary-deep"
              >
                {m.nav.signUp}
              </Link>
              <Link
                href="/wholesale"
                className="inline-flex rounded-full bg-gradient-to-r from-brand-primary to-brand-coral px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:brightness-105 sm:text-sm"
              >
                {m.nav.buyKit}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 border-t border-ink-100 pt-3 lg:hidden">
          <Link href="/" className="text-xs font-semibold text-emerald-600">
            {m.nav.home}
          </Link>
          <Link href="/suppliers" className="text-xs font-semibold text-rose-500">
            {m.nav.directory}
          </Link>
          <Link href="/patterns" className="text-xs font-semibold text-orange-500">
            {m.nav.patterns}
          </Link>
          <Link href="/creators" className="text-xs font-semibold text-violet-600">
            {m.nav.community}
          </Link>
          <Link href="/learn" className="text-xs font-semibold text-sky-600">
            {m.nav.blog}
          </Link>
          <Link href="/tools/image-to-pattern" className="text-xs font-semibold text-amber-600">
            {m.nav.tools}
          </Link>
          <Link href="/#quick-inquiry" className="text-xs font-semibold text-brand-secondary">
            {m.nav.contact}
          </Link>
        </div>
      </div>
    </header>
  );
}

function CartIcon() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}
