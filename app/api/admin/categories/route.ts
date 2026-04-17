import { logAdminAction } from "@/lib/admin/admin-logger";
import { jsonError, requireAdminRequest, requireServiceClient } from "@/lib/admin/api-auth";
import { jsonList, sanitizeIlikeSearch } from "@/lib/admin/http";
import { parseListParams } from "@/lib/admin/list-params";
import { canAccess } from "@/lib/admin/permissions";
import { categoryCreateSchema, parseJsonBody } from "@/lib/admin/schemas";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;
  if (!canAccess(auth.ctx.role, "categories", "GET")) {
    return jsonError(403, "Forbidden", "forbidden");
  }
  const svc = requireServiceClient();
  if (!svc.ok) return svc.response;
  const { supabase } = svc;

  const url = new URL(request.url);
  const { page, limit, offset, search } = parseListParams(url.searchParams);
  const q = sanitizeIlikeSearch(search);

  let query = supabase.from("categories").select("*", { count: "exact" });

  if (q) {
    const p = `%${q}%`;
    query = query.or(`name.ilike.${p},slug.ilike.${p}`);
  }

  query = query.order("sort_order", { ascending: true }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) {
    console.error("[admin categories GET]", error.message);
    return jsonError(500, error.message, "database");
  }

  return jsonList(data ?? [], count ?? 0, page, limit);
}

export async function POST(request: Request) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;
  if (!canAccess(auth.ctx.role, "categories", "POST")) {
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

  const parsed = parseJsonBody(raw, categoryCreateSchema);
  if (!parsed.ok) return jsonError(400, parsed.error, "validation");

  const { data, error } = await supabase.from("categories").insert(parsed.data).select("*").single();
  if (error) {
    console.error("[admin categories POST]", error.message);
    return jsonError(500, error.message, "database");
  }

  await logAdminAction(supabase, {
    adminId: auth.ctx.adminId,
    action: "create",
    tableName: "categories",
    recordId: data?.id ? String(data.id) : null,
    changes: { after: data },
  });

  return NextResponse.json({ data }, { status: 201 });
}
