import { logAdminAction } from "@/lib/admin/admin-logger";
import { jsonError, requireAdminRequest, requireServiceClient } from "@/lib/admin/api-auth";
import { jsonData } from "@/lib/admin/http";
import { canAccess } from "@/lib/admin/permissions";
import { categoryUpdateSchema, parseJsonBody, uuidParam } from "@/lib/admin/schemas";
import { NextResponse } from "next/server";

type Ctx = { params: { id: string } };

export async function GET(_request: Request, context: Ctx) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;
  if (!canAccess(auth.ctx.role, "categories", "GET")) {
    return jsonError(403, "Forbidden", "forbidden");
  }
  const svc = requireServiceClient();
  if (!svc.ok) return svc.response;
  const { supabase } = svc;

  const idParse = uuidParam.safeParse(context.params.id);
  if (!idParse.success) return jsonError(400, "Invalid id", "validation");

  const { data, error } = await supabase.from("categories").select("*").eq("id", idParse.data).maybeSingle();
  if (error) {
    console.error("[admin categories GET id]", error.message);
    return jsonError(500, error.message, "database");
  }
  if (!data) return jsonError(404, "Not found", "not_found");
  return jsonData(data);
}

export async function PUT(request: Request, context: Ctx) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;
  if (!canAccess(auth.ctx.role, "categories", "PUT")) {
    return jsonError(403, "Forbidden", "forbidden");
  }
  const svc = requireServiceClient();
  if (!svc.ok) return svc.response;
  const { supabase } = svc;

  const idParse = uuidParam.safeParse(context.params.id);
  if (!idParse.success) return jsonError(400, "Invalid id", "validation");

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonError(400, "Invalid JSON body", "bad_request");
  }

  const parsed = parseJsonBody(raw, categoryUpdateSchema);
  if (!parsed.ok) return jsonError(400, parsed.error, "validation");

  const patch = { ...parsed.data };
  if (Object.keys(patch).length === 0) {
    return jsonError(400, "No fields to update", "validation");
  }

  const { data: before, error: fetchErr } = await supabase
    .from("categories")
    .select("*")
    .eq("id", idParse.data)
    .maybeSingle();
  if (fetchErr) {
    console.error("[admin categories PUT fetch]", fetchErr.message);
    return jsonError(500, fetchErr.message, "database");
  }
  if (!before) return jsonError(404, "Not found", "not_found");

  const { data, error } = await supabase.from("categories").update(patch).eq("id", idParse.data).select("*").single();
  if (error) {
    console.error("[admin categories PUT]", error.message);
    return jsonError(500, error.message, "database");
  }

  await logAdminAction(supabase, {
    adminId: auth.ctx.adminId,
    action: "update",
    tableName: "categories",
    recordId: idParse.data,
    changes: { before, after: data },
  });

  return jsonData(data);
}

export async function DELETE(_request: Request, context: Ctx) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;
  if (!canAccess(auth.ctx.role, "categories", "DELETE")) {
    return jsonError(403, "Forbidden", "forbidden");
  }
  const svc = requireServiceClient();
  if (!svc.ok) return svc.response;
  const { supabase } = svc;

  const idParse = uuidParam.safeParse(context.params.id);
  if (!idParse.success) return jsonError(400, "Invalid id", "validation");

  const { data: before, error: fetchErr } = await supabase
    .from("categories")
    .select("*")
    .eq("id", idParse.data)
    .maybeSingle();
  if (fetchErr) {
    console.error("[admin categories DELETE fetch]", fetchErr.message);
    return jsonError(500, fetchErr.message, "database");
  }
  if (!before) return jsonError(404, "Not found", "not_found");

  const { error } = await supabase.from("categories").delete().eq("id", idParse.data);
  if (error) {
    console.error("[admin categories DELETE]", error.message);
    return jsonError(500, error.message, "database");
  }

  await logAdminAction(supabase, {
    adminId: auth.ctx.adminId,
    action: "delete",
    tableName: "categories",
    recordId: idParse.data,
    changes: { before },
  });

  return NextResponse.json({ data: { id: idParse.data, deleted: true } });
}
