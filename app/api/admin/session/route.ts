import { NextResponse } from "next/server";

/** Legacy cookie login removed; use NextAuth at `/admin/login` and `signOut` from the client. */
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error:
        "Password-only admin login is disabled. Use /admin/login with email and password (NextAuth).",
    },
    { status: 410 },
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      ok: false,
      error: "Use NextAuth sign out from the admin UI (Sign out button).",
    },
    { status: 410 },
  );
}
