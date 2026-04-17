"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
        callbackUrl,
      });
      if (res?.error) {
        setError("Invalid email or password.");
        return;
      }
      router.push(callbackUrl.startsWith("/") ? callbackUrl : "/admin/dashboard");
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0b0e14] px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-700/80 bg-slate-900/60 p-8 shadow-2xl">
        <h1 className="font-heading text-2xl font-bold text-white">Admin sign in</h1>
        <p className="mt-2 text-sm text-slate-400">Use your admin email and password.</p>
        <p className="mt-2 text-xs text-slate-500">
          If you see{" "}
          <code className="rounded bg-slate-800 px-1 text-slate-300">JWTSessionError</code> or{" "}
          <code className="rounded bg-slate-800 px-1 text-slate-300">decryption failed</code> after changing{" "}
          <code className="rounded bg-slate-800 px-1 text-slate-300">NEXTAUTH_SECRET</code>,{" "}
          <a href="/api/auth/reset-session" className="text-fuchsia-400 underline hover:text-fuchsia-300">
            clear the session cookie
          </a>{" "}
          and sign in again.
        </p>
        <form onSubmit={(e) => void onSubmit(e)} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none focus:ring-2 focus:ring-fuchsia-500/60"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-600 bg-slate-950 px-3 py-2.5 text-slate-100 outline-none focus:ring-2 focus:ring-fuchsia-500/60"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-fuchsia-600 px-4 py-3 text-sm font-semibold text-white hover:bg-fuchsia-500 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
