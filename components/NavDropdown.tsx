import Link from "next/link";

type Item = { label: string; href: string };

type Props = {
  label: string;
  items: Item[];
  /** Extra classes for the trigger label (e.g. per-link brand colors). */
  summaryClassName?: string;
};

const panel =
  "pointer-events-none invisible absolute left-0 top-full z-50 w-max min-w-[11rem] -translate-y-1 pt-1 opacity-0 transition duration-150 ease-out motion-reduce:transition-none " +
  "group-hover/drop:pointer-events-auto group-hover/drop:visible group-hover/drop:translate-y-0 group-hover/drop:opacity-100 " +
  "group-focus-within/drop:pointer-events-auto group-focus-within/drop:visible group-focus-within/drop:translate-y-0 group-focus-within/drop:opacity-100";

/** Per-row hover accent so the menu feels playful, not default gray/black. */
const HOVER_ACCENT = [
  "hover:text-brand-primary hover:bg-brand-primary/12",
  "hover:text-brand-secondary hover:bg-brand-secondary/12",
  "hover:text-brand-lavender hover:bg-brand-lavender/20",
  "hover:text-orange-500 hover:bg-orange-100/80",
  "hover:text-sky-600 hover:bg-sky-100/70",
  "hover:text-rose-500 hover:bg-rose-100/70",
] as const;

function itemLinkClass(index: number): string {
  const accent = HOVER_ACCENT[index % HOVER_ACCENT.length];
  return [
    "mx-1.5 mb-0.5 block rounded-xl px-3 py-2.5 text-sm font-semibold tracking-tight text-brand-text/78 transition-colors duration-150",
    "outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-1",
    accent,
  ].join(" ");
}

export function NavDropdown({ label, items, summaryClassName = "" }: Props) {
  return (
    <div className="group/drop relative">
      <div
        tabIndex={0}
        className={`flex cursor-default select-none list-none items-center gap-0.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 ${
          summaryClassName || "text-ink-600"
        }`}
        aria-haspopup="menu"
      >
        {label}
        <span
          className="text-[0.65rem] opacity-80 transition group-hover/drop:rotate-180 group-hover/drop:opacity-100 motion-reduce:transition-none"
          aria-hidden
        >
          ▾
        </span>
      </div>
      <div className={panel}>
        <ul
          className="rounded-2xl border-2 border-brand-lavender/30 bg-gradient-to-b from-white via-brand-mint/10 to-brand-yellow/10 py-2 shadow-xl shadow-brand-primary/10 backdrop-blur-sm"
          role="menu"
          aria-label={label}
        >
          {items.map((item, index) => (
            <li key={item.href} role="none">
              <Link
                href={item.href}
                className={itemLinkClass(index)}
                role="menuitem"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
