import Link from "next/link";

export function AdminDetailShell({
  title,
  subtitle,
  backHref,
  children,
}: {
  title: string;
  subtitle?: string;
  backHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <Link href={backHref} className="text-sm font-medium text-fuchsia-400 hover:text-fuchsia-300 hover:underline">
        ← Back to list
      </Link>
      <h1 className="mt-4 font-heading text-2xl font-bold text-slate-100">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
      <div className="mt-6 rounded-2xl border border-slate-700/80 bg-slate-900/40 p-6 shadow-lg shadow-fuchsia-950/10">{children}</div>
    </div>
  );
}
