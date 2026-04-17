import { logAdminAction } from "@/lib/admin/admin-logger";
import { jsonError, requireAdminRequest, requireServiceClient } from "@/lib/admin/api-auth";
import { jsonData } from "@/lib/admin/http";
import { canAccess, canWriteSettings } from "@/lib/admin/permissions";
import { parseJsonBody, settingsPutSchema } from "@/lib/admin/schemas";

export async function GET(request: Request) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;
  if (!canAccess(auth.ctx.role, "settings", "GET")) {
    return jsonError(403, "Forbidden", "forbidden");
  }
  const svc = requireServiceClient();
  if (!svc.ok) return svc.response;
  const { supabase } = svc;

  const { data, error } = await supabase.from("admin_settings").select("*").eq("id", 1).maybeSingle();
  if (error) {
    console.error("[admin settings GET]", error.message);
    return jsonError(500, error.message, "database");
  }

  const payload = (data as { data?: Record<string, unknown> } | null)?.data ?? {};
  const updated_at = (data as { updated_at?: string } | null)?.updated_at ?? null;
  return jsonData({ settings: payload, updated_at });
}

export async function PUT(request: Request) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;
  if (!canAccess(auth.ctx.role, "settings", "PUT")) {
    return jsonError(403, "Forbidden", "forbidden");
  }
  if (!canWriteSettings(auth.ctx.role)) {
    return jsonError(403, "Only super_admin can update settings", "forbidden");
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

  const parsed = parseJsonBody(raw, settingsPutSchema);
  if (!parsed.ok) return jsonError(400, parsed.error, "validation");

  const { data: before } = await supabase.from("admin_settings").select("*").eq("id", 1).maybeSingle();

  const { data, error } = await supabase
    .from("admin_settings")
    .upsert(
      { id: 1, data: parsed.data.data },
      { onConflict: "id" },
    )
    .select("*")
    .single();

  if (error) {
    console.error("[admin settings PUT]", error.message);
    return jsonError(500, error.message, "database");
  }

  await logAdminAction(supabase, {
    adminId: auth.ctx.adminId,
    action: "update",
    tableName: "admin_settings",
    recordId: null,
    changes: { before, after: data },
  });

  return jsonData({
    settings: (data as { data: Record<string, unknown> }).data,
    updated_at: (data as { updated_at?: string }).updated_at ?? null,
  });
}
