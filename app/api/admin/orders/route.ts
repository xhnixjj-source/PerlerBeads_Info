import { jsonError, requireAdminRequest, requireServiceClient } from "@/lib/admin/api-auth";
import { jsonList, sanitizeIlikeSearch } from "@/lib/admin/http";
import { parseListParams } from "@/lib/admin/list-params";
import { canAccess } from "@/lib/admin/permissions";

export async function GET(request: Request) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;
  if (!canAccess(auth.ctx.role, "orders", "GET")) {
    return jsonError(403, "Forbidden", "forbidden");
  }
  const svc = requireServiceClient();
  if (!svc.ok) return svc.response;
  const { supabase } = svc;

  const url = new URL(request.url);
  const { page, limit, offset, search, filter } = parseListParams(url.searchParams);
  const q = sanitizeIlikeSearch(search);

  let query = supabase.from("orders").select("*", { count: "exact" });

  if (q) {
    const p = `%${q}%`;
    query = query.or(`order_number.ilike.${p}`);
  }
  if (typeof filter.status === "string" && filter.status) {
    query = query.eq("status", filter.status);
  }
  if (typeof filter.pattern_id === "string" && filter.pattern_id) {
    query = query.eq("pattern_id", filter.pattern_id);
  }

  query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) {
    console.error("[admin orders GET]", error.message);
    return jsonError(500, error.message, "database");
  }

  const total = count ?? 0;
  return jsonList(data ?? [], total, page, limit);
}
