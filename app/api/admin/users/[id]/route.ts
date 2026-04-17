import { logAdminAction } from "@/lib/admin/admin-logger";
import { jsonError, requireAdminRequest, requireServiceClient } from "@/lib/admin/api-auth";
import { canAccess } from "@/lib/admin/permissions";
import { adminUserUpdateSchema, parseJsonBody, uuidParam } from "@/lib/admin/schemas";
import { NextResponse } from "next/server";

type Ctx = { params: { id: string } };

export async function PATCH(request: Request, context: Ctx) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;
  if (!canAccess(auth.ctx.role, "users", "PUT")) {
    return jsonError(403, "Forbidden", "forbidden");
  }

  let idParsed: string;
  try {
    idParsed = uuidParam.parse(context.params.id);
  } catch {
    return jsonError(400, "Invalid id", "validation");
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
  const parsed = parseJsonBody(raw, adminUserUpdateSchema);
  if (!parsed.ok) return jsonError(400, parsed.error, "validation");

  const { data: before } = await supabase.from("admin_users").select("role").eq("id", idParsed).maybeSingle();

  const { data: row, error } = await supabase
    .from("admin_users")
    .update({ role: parsed.data.role })
    .eq("id", idParsed)
    .select("id, email, role, last_login, created_at, updated_at")
    .maybeSingle();

  if (error) {
    console.error("[admin users PATCH]", error.message);
    return jsonError(500, error.message, "database");
  }
  if (!row) {
    return jsonError(404, "Not found", "not_found");
  }

  await logAdminAction(supabase, {
    adminId: auth.ctx.adminId,
    action: "update",
    tableName: "admin_users",
    recordId: idParsed,
    changes: { role: { from: before?.role, to: parsed.data.role } },
  });

  return NextResponse.json({ data: row });
}

export async function DELETE(_request: Request, context: Ctx) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;
  if (!canAccess(auth.ctx.role, "users", "DELETE")) {
    return jsonError(403, "Forbidden", "forbidden");
  }

  let idParsed: string;
  try {
    idParsed = uuidParam.parse(context.params.id);
  } catch {
    return jsonError(400, "Invalid id", "validation");
  }

  if (idParsed === auth.ctx.adminId) {
    return jsonError(400, "Cannot delete your own account", "validation");
  }

  const svc = requireServiceClient();
  if (!svc.ok) return svc.response;
  const { supabase } = svc;

  const { data: existing } = await supabase.from("admin_users").select("email, role").eq("id", idParsed).maybeSingle();
  if (!existing) {
    return jsonError(404, "Not found", "not_found");
  }

  const { error } = await supabase.from("admin_users").delete().eq("id", idParsed);
  if (error) {
    console.error("[admin users DELETE]", error.message);
    return jsonError(500, error.message, "database");
  }

  await logAdminAction(supabase, {
    adminId: auth.ctx.adminId,
    action: "delete",
    tableName: "admin_users",
    recordId: idParsed,
    changes: { email: existing.email, role: existing.role },
  });

  return NextResponse.json({ ok: true });
}
