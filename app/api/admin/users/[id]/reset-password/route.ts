import { logAdminAction } from "@/lib/admin/admin-logger";
import { jsonError, requireAdminRequest, requireServiceClient } from "@/lib/admin/api-auth";
import { canAccess } from "@/lib/admin/permissions";
import { adminUserResetPasswordSchema, parseJsonBody, uuidParam } from "@/lib/admin/schemas";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

type Ctx = { params: { id: string } };

export async function POST(request: Request, context: Ctx) {
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
  const parsed = parseJsonBody(raw, adminUserResetPasswordSchema);
  if (!parsed.ok) return jsonError(400, parsed.error, "validation");

  const password_hash = await bcrypt.hash(parsed.data.password, 12);

  const { data: row, error } = await supabase
    .from("admin_users")
    .update({ password_hash })
    .eq("id", idParsed)
    .select("id, email, role")
    .maybeSingle();

  if (error) {
    console.error("[admin users reset-password]", error.message);
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
    changes: { password_reset: true },
  });

  return NextResponse.json({ ok: true, data: row });
}
