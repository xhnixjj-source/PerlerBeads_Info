import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";
import { formatTpl } from "@/lib/i18n/format";
import type { Messages } from "@/messages";

const social = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: InstagramIcon,
  },
  { label: "TikTok", href: "https://tiktok.com", icon: TikTokIcon },
  { label: "Pinterest", href: "https://pinterest.com", icon: PinterestIcon },
  { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
];

export function SiteFooter({ messages: m }: { messages: Messages }) {
  const copyright = formatTpl(m.footer.copyright, { year: new Date().getFullYear() });
  return (
    <footer className="mt-14 bg-brand-surface">
      <div className="rainbow-rule mx-auto max-w-7xl" aria-hidden />
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 text-sm sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-heading font-bold text-brand-text">{m.footer.about}</p>
          <ul className="mt-3 space-y-2 text-brand-text/75">
            <li>
              <Link href="/#about" className="hover:text-brand-text">
                {m.footer.aboutUs}
              </Link>
            </li>
            <li>
              <Link href="/#quick-inquiry" className="hover:text-brand-text">
                {m.footer.contact}
              </Link>
            </li>
            <li>
              <span className="cursor-not-allowed opacity-60">{m.footer.terms}</span>
            </li>
            <li>
              <span className="cursor-not-allowed opacity-60">{m.footer.privacy}</span>
            </li>
            <li>
              <span className="cursor-not-allowed opacity-60">{m.footer.faqs}</span>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-heading font-bold text-brand-text">{m.footer.quickLinks}</p>
          <ul className="mt-3 space-y-2">
            <Link
              className="block text-brand-text/75 hover:text-brand-text"
              href="/patterns?tag=anime"
            >
              {m.footer.popularAnime}
            </Link>
            <Link className="block text-brand-text/75 hover:text-brand-text" href="/suppliers">
              {m.footer.supplierDir}
            </Link>
            <Link className="block text-brand-text/75 hover:text-brand-text" href="/learn#buying-guide">
              {m.footer.buyingGuide}
            </Link>
          </ul>
        </div>

        <div>
          <p className="font-heading font-bold text-brand-text">{m.footer.social}</p>
          <ul className="mt-3 flex flex-wrap gap-3">
            {social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200/80 bg-white text-brand-text/70 shadow-sm transition hover:border-brand-secondary hover:text-brand-secondary"
                  aria-label={s.label}
                >
                  <s.icon />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-ink-200/80 py-6 text-center text-xs text-brand-text/55">{copyright}</div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zm6.5-.75a1 1 0 100 2 1 1 0 000-2zM12 9a3 3 0 110 6 3 3 0 010-6z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.5 5.5c1.8 0 3.3 1.4 3.5 3.2V14c0 3.5-2.6 6.3-6 6.5-3.6.2-6.5-2.7-6.5-6.3 0-2.2 1.1-4.1 2.8-5.2v3.3c-.8.5-1.3 1.4-1.3 2.4 0 1.6 1.3 2.9 2.9 2.9s2.9-1.3 2.9-2.9V2h3.2c.1.6.3 1.2.5 1.7z" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.5 7.8 6 9.3-.1-.8-.1-2 0-2.9.1-.9.9-5.5.9-5.5s-.2-.5-.2-1.2c0-1.1.6-2 1.4-2 .7 0 1 .5 1 1.1 0 .7-.4 1.7-.7 2.7-.2.8.4 1.5 1.3 1.5 3.1 0 5.2-3.4 5.2-7.5 0-1.8-.6-3.2-1.8-4.3-1.1-1-2.5-1.5-4-1.5-3 0-5.5 2-5.5 4.5 0 .9.3 1.7.9 2.3.1.1.1.2.1.4l-.3 1.4c-.1.4-.3.5-.7.3-1.6-.8-2.6-3.1-2.6-5 0-3.7 3.1-7.2 8.2-7.2 4.3 0 7.2 3.1 7.2 7.1 0 4.4-2.5 7.7-6.1 7.7-1.2 0-2.3-.6-2.7-1.3l-.8 2.9c-.3 1-1.1 2.2-1.6 3 1.2.4 2.5.6 3.8.6 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.5 22v-8.5h2.8l.4-3.3h-3.2V8.2c0-.9.3-1.6 1.7-1.6H17V3.6c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6v2.6H7v3.3h3V22h3.5z" />
    </svg>
  );
}
