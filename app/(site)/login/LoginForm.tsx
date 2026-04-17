"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

export function LoginForm({
  googleEnabled,
  facebookEnabled,
}: {
  googleEnabled: boolean;
  facebookEnabled: boolean;
}) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-heading text-2xl font-bold text-ink-900">Sign in</h1>
      <p className="mt-2 text-sm text-ink-600">
        Use Google or Facebook for the store. Admins should use{" "}
        <Link href="/admin/login" className="font-medium text-brand-secondary underline">
          Admin sign in
        </Link>
        .
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {googleEnabled ? (
          <button
            type="button"
            onClick={() => void signIn("google", { callbackUrl: "/" })}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm font-semibold text-ink-800 shadow-sm hover:bg-ink-50"
          >
            Continue with Google
          </button>
        ) : (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
            Google OAuth is not configured (set <code className="font-mono">GOOGLE_CLIENT_ID</code> and{" "}
            <code className="font-mono">GOOGLE_CLIENT_SECRET</code>).
          </p>
        )}
        {facebookEnabled ? (
          <button
            type="button"
            onClick={() => void signIn("facebook", { callbackUrl: "/" })}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1877F2] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:brightness-110"
          >
            Continue with Facebook
          </button>
        ) : (
          <p className="rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-600">
            Facebook OAuth is optional (set <code className="font-mono">FACEBOOK_CLIENT_ID</code> and{" "}
            <code className="font-mono">FACEBOOK_CLIENT_SECRET</code>).
          </p>
        )}
      </div>
    </main>
  );
}
