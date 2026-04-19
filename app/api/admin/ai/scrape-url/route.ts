import { checkAdminAiRateLimit } from "@/lib/admin/ai-rate-limit";
import { jsonError, requireAdminRequest } from "@/lib/admin/api-auth";
import { jsonData } from "@/lib/admin/http";
import { canAccess } from "@/lib/admin/permissions";
import { parseJsonBody } from "@/lib/admin/schemas";
import { firecrawlScrape, isFirecrawlConfigured } from "@/lib/firecrawl/client";
import { z } from "zod";

export const runtime = "nodejs";

const bodySchema = z.object({
  url: z.string().url(),
});

function canUseScrape(role: Parameters<typeof canAccess>[0]): boolean {
  return canAccess(role, "products", "POST") || canAccess(role, "blog", "POST");
}

export async function POST(request: Request) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;
  if (!canUseScrape(auth.ctx.role)) {
    return jsonError(403, "Forbidden", "forbidden");
  }
  if (!isFirecrawlConfigured()) {
    return jsonError(503, "Firecrawl not configured (FIRECRAWL_API_KEY)", "firecrawl");
  }

  const key = `scrape:${auth.ctx.adminId}`;
  if (!checkAdminAiRateLimit(key, 60_000, 30)) {
    return jsonError(429, "Too many scrape requests; try again in a minute.", "rate_limit");
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonError(400, "Invalid JSON", "bad_request");
  }

  const parsed = parseJsonBody(raw, bodySchema);
  if (!parsed.ok) return jsonError(400, parsed.error, "validation");

  try {
    const out = await firecrawlScrape(parsed.data.url);
    return jsonData({
      url: parsed.data.url,
      markdown: out.markdown,
      metadata: out.metadata,
      links: out.links ?? [],
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Scrape failed";
    console.error("[scrape-url]", msg);
    return jsonError(502, msg, "firecrawl");
  }
}
