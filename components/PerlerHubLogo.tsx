import Link from "next/link";

const LETTER_COLORS = [
  "#F97316",
  "#EC4899",
  "#3B82F6",
  "#22C55E",
  "#A855F7",
  "#FF6BEB",
  "#4ECDC4",
  "#FBBF24",
];

const LETTERS = "PerlerHub".split("");

type Props = {
  className?: string;
};

export function PerlerHubLogo({ className = "" }: Props) {
  return (
    <Link
      href="/"
      className={`font-heading text-xl font-extrabold tracking-tight sm:text-2xl ${className}`}
      aria-label="PerlerHub home"
    >
      {LETTERS.map((ch, i) => (
        <span key={`${ch}-${i}`} style={{ color: LETTER_COLORS[i % LETTER_COLORS.length] }}>
          {ch}
        </span>
      ))}
    </Link>
  );
}
