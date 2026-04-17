export type ParsedListParams = {
  page: number;
  limit: number;
  offset: number;
  search: string;
  /** Parsed JSON object from `filter` query param */
  filter: Record<string, unknown>;
};

const MAX_LIMIT = 100;

export function parseListParams(searchParams: URLSearchParams): ParsedListParams {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  let limit = parseInt(searchParams.get("limit") || "10", 10) || 10;
  if (limit < 1) limit = 10;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;
  const offset = (page - 1) * limit;
  const search = (searchParams.get("search") || "").trim();
  let filter: Record<string, unknown> = {};
  const rawFilter = searchParams.get("filter");
  if (rawFilter) {
    try {
      const parsed = JSON.parse(rawFilter) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        filter = parsed as Record<string, unknown>;
      }
    } catch {
      /* ignore invalid JSON */
    }
  }
  return { page, limit, offset, search, filter };
}

export function listMeta(total: number, page: number, limit: number) {
  return { total, page, limit };
}
