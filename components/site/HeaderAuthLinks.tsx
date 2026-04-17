"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

type Props = {
  signInLabel: string;
  signUpLabel: string;
  signOutLabel: string;
};

export function HeaderAuthLinks({ signInLabel, signUpLabel, signOutLabel }: Props) {
  const { data: session, status } = useSession();
  const kind = session?.user?.kind;
  const signedIn = Boolean(session?.user?.email);

  if (status === "loading") {
    return <span className="text-sm text-brand-text/50">…</span>;
  }

  if (signedIn && session?.user) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="max-w-[10rem] truncate text-sm text-brand-text/80" title={session.user.email ?? ""}>
          {session.user.name ?? session.user.email}
        </span>
        {kind === "admin" ? (
          <span className="rounded-md bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-600">Admin</span>
        ) : null}
        <button
          type="button"
          onClick={() => void signOut({ callbackUrl: "/" })}
          className="text-sm font-medium text-brand-text/70 hover:text-brand-text"
        >
          {signOutLabel}
        </button>
      </div>
    );
  }

  return (
    <>
      <Link href="/login" className="text-sm font-medium text-brand-text/70 hover:text-brand-text">
        {signInLabel}
      </Link>
      <Link href="/login" className="text-sm font-medium text-brand-secondary hover:text-brand-secondary-deep">
        {signUpLabel}
      </Link>
    </>
  );
}
