import { logAdminAction } from "@/lib/admin/admin-logger";
import { jsonError, requireAdminRequest, requireServiceClient } from "@/lib/admin/api-auth";
import { jsonList, sanitizeIlikeSearch } from "@/lib/admin/http";
import { parseListParams } from "@/lib/admin/list-params";
import { canAccess } from "@/lib/admin/permissions";
import { blogCreateSchema, parseJsonBody } from "@/lib/admin/schemas";
import { NextResponse } from "next/server";

function normalizePublishedAt<T extends { published_at?: string | null | undefined }>(row: T) {
  const copy = { ...row };
  if (copy.published_at === "") copy.published_at = null;
  return copy;
}

export async function GET(request: Request) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;
  if (!canAccess(auth.ctx.role, "blog", "GET")) {
    return jsonError(403, "Forbidden", "forbidden");
  }
  const svc = requireServiceClient();
  if (!svc.ok) return svc.response;
  const { supabase } = svc;

  const url = new URL(request.url);
  const { page, limit, offset, search, filter } = parseListParams(url.searchParams);
  const q = sanitizeIlikeSearch(search);

  let query = supabase.from("blog_posts").select("*", { count: "exact" });

  if (q) {
    const p = `%${q}%`;
    query = query.or(`title.ilike.${p},slug.ilike.${p}`);
  }
  if (typeof filter.status === "string" && filter.status) {
    query = query.eq("status", filter.status);
  }

  query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) {
    console.error("[admin blog GET]", error.message);
    return jsonError(500, error.message, "database");
  }

  const total = count ?? 0;
  return jsonList(data ?? [], total, page, limit);
}

export async function POST(request: Request) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;
  if (!canAccess(auth.ctx.role, "blog", "POST")) {
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

  const parsed = parseJsonBody(raw, blogCreateSchema);
  if (!parsed.ok) return jsonError(400, parsed.error, "validation");

  const row = normalizePublishedAt(parsed.data);

  const { data, error } = await supabase.from("blog_posts").insert(row).select("*").single();
  if (error) {
    console.error("[admin blog POST]", error.message);
    return jsonError(500, error.message, "database");
  }

  await logAdminAction(supabase, {
    adminId: auth.ctx.adminId,
    action: "create",
    tableName: "blog_posts",
    recordId: data?.id ? String(data.id) : null,
    changes: { after: data },
  });

  return NextResponse.json({ data }, { status: 201 });
}
