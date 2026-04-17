import { logAdminAction } from "@/lib/admin/admin-logger";
import { jsonError, requireAdminRequest, requireServiceClient } from "@/lib/admin/api-auth";
import { jsonList } from "@/lib/admin/http";
import { canAccess } from "@/lib/admin/permissions";
import { adminUserCreateSchema, parseJsonBody } from "@/lib/admin/schemas";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;
  if (!canAccess(auth.ctx.role, "users", "GET")) {
    return jsonError(403, "Forbidden", "forbidden");
  }
  const svc = requireServiceClient();
  if (!svc.ok) return svc.response;
  const { supabase } = svc;

  const { data, error } = await supabase
    .from("admin_users")
    .select("id, email, role, last_login, created_at, updated_at")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[admin users GET]", error.message);
    return jsonError(500, error.message, "database");
  }
  const rows = data ?? [];
  const total = rows.length;
  return jsonList(rows, total, 1, Math.max(total, 1));
}

export async function POST(request: Request) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;
  if (!canAccess(auth.ctx.role, "users", "POST")) {
    return jsonError(403, "Forbidden", "forbidden");
  }
  const svc = requireServiceClient();
  if (!svc.ok) return svc.response;
  const { supabase } = svc;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonError(400, "Invalid JSON body", "bad_request");
  }
  const parsed = parseJsonBody(raw, adminUserCreateSchema);
  if (!parsed.ok) return jsonError(400, parsed.error, "validation");

  const email = parsed.data.email.trim().toLowerCase();
  const password_hash = await bcrypt.hash(parsed.data.password, 12);

  const { data: row, error } = await supabase
    .from("admin_users")
    .insert({
      email,
      password_hash,
      role: parsed.data.role,
    })
    .select("id, email, role, last_login, created_at, updated_at")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      return jsonError(409, "Email already exists", "conflict");
    }
    console.error("[admin users POST]", error.message);
    return jsonError(500, error.message, "database");
  }

  await logAdminAction(supabase, {
    adminId: auth.ctx.adminId,
    action: "create",
    tableName: "admin_users",
    recordId: row?.id ?? null,
    changes: { email, role: parsed.data.role },
  });

  return NextResponse.json({ data: row });
}
