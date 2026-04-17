import { authOptions } from "@/lib/auth";
import type { AdminContext, AdminRole } from "@/lib/admin/permissions";
import { isAdminRole } from "@/lib/admin/permissions";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export type { AdminRole, AdminContext } from "@/lib/admin/permissions";

function jsonError(status: number, message: string, code?: string) {
  return NextResponse.json(
    { error: { message, code: code ?? "error", status } },
    { status },
  );
}

/**
 * Validates NextAuth session (JWT). Use in Route Handlers and Server Actions.
 */
export async function requireAdminRequest(): Promise<
  { ok: true; ctx: AdminContext } | { ok: false; response: NextResponse }
> {
  const session = await getServerSession(authOptions);
  const id = session?.user?.id;
  const rawRole = session?.user?.role;
  const role = typeof rawRole === "string" && isAdminRole(rawRole) ? rawRole : undefined;

  if (!id || !role) {
    return { ok: false, response: jsonError(401, "Unauthorized", "unauthorized") };
  }

  return {
    ok: true,
    ctx: { adminId: id, role },
  };
}

export function requireServiceClient():
  | { ok: true; supabase: NonNullable<ReturnType<typeof createSupabaseServiceClient>> }
  | { ok: false; response: NextResponse } {
  const supabase = createSupabaseServiceClient();
  if (!supabase) {
    return {
      ok: false,
      response: jsonError(503, "Supabase service client not configured", "supabase"),
    };
  }
  return { ok: true, supabase };
}

export { jsonError };
