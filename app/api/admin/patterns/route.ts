import { logAdminAction } from "@/lib/admin/admin-logger";
import { jsonError, requireAdminRequest, requireServiceClient } from "@/lib/admin/api-auth";
import { jsonList, sanitizeIlikeSearch } from "@/lib/admin/http";
import { parseListParams } from "@/lib/admin/list-params";
import { canAccess } from "@/lib/admin/permissions";
import { parseJsonBody, patternCreateSchema } from "@/lib/admin/schemas";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;
  if (!canAccess(auth.ctx.role, "patterns", "GET")) {
    return jsonError(403, "Forbidden", "forbidden");
  }
  const svc = requireServiceClient();
  if (!svc.ok) return svc.response;
  const { supabase } = svc;

  const url = new URL(request.url);
  const { page, limit, offset, search, filter } = parseListParams(url.searchParams);
  const q = sanitizeIlikeSearch(search);

  let query = supabase.from("patterns").select("*", { count: "exact" });

  if (q) {
    const p = `%${q}%`;
    query = query.or(`title.ilike.${p},slug.ilike.${p}`);
  }
  if (typeof filter.difficulty === "string" && filter.difficulty) {
    query = query.eq("difficulty", filter.difficulty);
  }

  query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) {
    console.error("[admin patterns GET]", error.message);
    return jsonError(500, error.message, "database");
  }

  const total = count ?? 0;
  return jsonList(data ?? [], total, page, limit);
}

export async function POST(request: Request) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;
  if (!canAccess(auth.ctx.role, "patterns", "POST")) {
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

  const parsed = parseJsonBody(raw, patternCreateSchema);
  if (!parsed.ok) return jsonError(400, parsed.error, "validation");

  const row = { ...parsed.data };

  const { data, error } = await supabase.from("patterns").insert(row).select("*").single();
  if (error) {
    console.error("[admin patterns POST]", error.message);
    return jsonError(500, error.message, "database");
  }

  await logAdminAction(supabase, {
    adminId: auth.ctx.adminId,
    action: "create",
    tableName: "patterns",
    recordId: data?.id ? String(data.id) : null,
    changes: { after: data },
  });

  return NextResponse.json({ data }, { status: 201 });
}
