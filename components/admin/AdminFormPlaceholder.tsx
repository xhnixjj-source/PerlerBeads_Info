export function AdminFormPlaceholder({ entity }: { entity: string }) {
  return (
    <div className="space-y-4 text-sm text-slate-400">
      <p>
        Full editor for this {entity} can be wired to Supabase <code className="rounded bg-slate-800 px-1 text-fuchsia-300">insert</code> /{" "}
        <code className="rounded bg-slate-800 px-1 text-fuchsia-300">update</code> when you are ready.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Slug</span>
          <input
            readOnly
            className="w-full cursor-not-allowed rounded-xl border border-slate-700 bg-slate-950/50 px-3 py-2 text-slate-300"
            placeholder="readonly"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Title / name</span>
          <input
            readOnly
            className="w-full cursor-not-allowed rounded-xl border border-slate-700 bg-slate-950/50 px-3 py-2 text-slate-300"
            placeholder="readonly"
          />
        </label>
      </div>
      <button
        type="button"
        disabled
        className="rounded-xl bg-gradient-to-r from-fuchsia-600/50 to-teal-500/50 px-5 py-2.5 text-sm font-semibold text-slate-400"
      >
        Save changes (coming soon)
      </button>
    </div>
  );
}
