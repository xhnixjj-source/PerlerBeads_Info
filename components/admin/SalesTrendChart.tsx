import type { SalesDay } from "@/lib/admin/dashboard-stats";

type Props = {
  data: SalesDay[];
};

export function SalesTrendChart({ data }: Props) {
  const max = Math.max(...data.map((d) => d.total), 0.01);
  const maxH = 120;

  return (
    <div>
      <p className="mb-4 text-sm text-slate-400">Revenue from paid pipeline orders (USD), last 7 days</p>
      <div className="flex h-40 items-end justify-between gap-1 sm:gap-2">
        {data.map((d) => {
          const h = Math.max(6, (d.total / max) * maxH);
          const label = d.date.slice(5);
          return (
            <div key={d.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="flex h-32 w-full flex-col justify-end">
                <div
                  className="mx-auto w-full max-w-[2.75rem] rounded-t-lg bg-gradient-to-t from-fuchsia-500 via-pink-400 to-teal-400 shadow-[0_0_20px_rgba(255,107,235,0.25)]"
                  style={{ height: `${h}px` }}
                  title={`${d.date}: $${d.total.toFixed(2)}`}
                />
              </div>
              <span className="text-[10px] font-medium text-slate-500 sm:text-xs">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
