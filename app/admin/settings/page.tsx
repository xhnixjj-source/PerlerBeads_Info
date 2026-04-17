export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-100">Settings</h1>
        <p className="mt-1 text-sm text-slate-400">Environment and integration checklist for this deployment.</p>
      </div>

      <section className="rounded-2xl border border-slate-700/80 bg-slate-900/40 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Supabase</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-300">
          <li>
            <code className="text-fuchsia-300">NEXT_PUBLIC_SUPABASE_URL</code> — project URL
          </li>
          <li>
            <code className="text-fuchsia-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> — public anon key
          </li>
          <li>
            <code className="text-fuchsia-300">SUPABASE_SERVICE_ROLE_KEY</code> — server-only (admin lists &amp; dashboard)
          </li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-700/80 bg-slate-900/40 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Admin access</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-300">
          <li>
            <code className="text-teal-300">NEXTAUTH_SECRET</code> — required (generate a long random string)
          </li>
          <li>
            <code className="text-teal-300">NEXTAUTH_URL</code> — canonical site URL (e.g. https://perlerbeadschan.com)
          </li>
          <li>
            <code className="text-teal-300">AUTH_COOKIE_DOMAIN</code> — optional; use{" "}
            <code className="text-slate-200">.perlerbeadschan.com</code> to share the session cookie on{" "}
            <code className="text-slate-200">admin.*</code>
          </li>
          <li>
            Admins are rows in <code className="text-slate-200">public.admin_users</code> (email + bcrypt{" "}
            <code className="text-slate-200">password_hash</code>). Create the first user with{" "}
            <code className="text-amber-200/90">npm run create-admin</code>.
          </li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-700/80 bg-slate-900/40 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Schema</h2>
        <p className="mt-2 text-sm text-slate-300">
          Run <code className="text-amber-200/90">supabase_schema.sql</code> and{" "}
          <code className="text-amber-200/90">supabase_admin_schema.sql</code> in the Supabase SQL editor so tables like{" "}
          <code className="text-slate-200">products</code> and <code className="text-slate-200">blog_posts</code> exist.
        </p>
      </section>
    </div>
  );
}
