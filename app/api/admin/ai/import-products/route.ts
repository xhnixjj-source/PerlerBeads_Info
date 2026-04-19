import { logAdminAction } from "@/lib/admin/admin-logger";
import { checkAdminAiRateLimit } from "@/lib/admin/ai-rate-limit";
import { jsonError, requireAdminRequest, requireServiceClient } from "@/lib/admin/api-auth";
import { canAccess } from "@/lib/admin/permissions";
import { parseJsonBody, productCreateSchema } from "@/lib/admin/schemas";
import { firecrawlScrape, isFirecrawlConfigured } from "@/lib/firecrawl/client";
import { isVertexConfigured } from "@/lib/vertex-ai/client";
import { mapVertexClientError } from "@/lib/vertex-ai/route-errors";
import { generateProductDraftFromMarkdown } from "@/lib/vertex-ai/product-importer";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const MAX_URLS = 10;

const bodySchema = z.object({
  urls: z.array(z.string().url()).min(1).max(MAX_URLS),
  category_id: z.string().uuid(),
});

function slugifyBase(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

async function ensureUniqueProductSlug(supabase: SupabaseClient, base: string): Promise<string> {
  const slugBase = base || `product-${Date.now()}`;
  for (let i = 0; i < 60; i++) {
    const trySlug = i === 0 ? slugBase : `${slugBase}-${i + 1}`;
    const { data } = await supabase.from("products").select("id").eq("slug", trySlug).maybeSingle();
    if (!data) return trySlug;
  }
  return `${slugBase}-${Date.now()}`;
}

export async function POST(request: Request) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;
  if (!canAccess(auth.ctx.role, "products", "POST")) {
    return jsonError(403, "Forbidden", "forbidden");
  }
  if (!isVertexConfigured()) {
    return jsonError(503, "Vertex AI not configured (GOOGLE_CLOUD_PROJECT_ID, GOOGLE_CLOUD_LOCATION)", "vertex");
  }
  if (!isFirecrawlConfigured()) {
    return jsonError(503, "Firecrawl not configured (FIRECRAWL_API_KEY)", "firecrawl");
  }

  const rlKey = `import-products:${auth.ctx.adminId}`;
  if (!checkAdminAiRateLimit(rlKey, 60_000, 8)) {
    return jsonError(429, "Too many import batches; try again in a minute.", "rate_limit");
  }

  const svc = requireServiceClient();
  if (!svc.ok) return svc.response;
  const { supabase } = svc;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonError(400, "Invalid JSON", "bad_request");
  }

  const parsed = parseJsonBody(raw, bodySchema);
  if (!parsed.ok) return jsonError(400, parsed.error, "validation");

  const { urls, category_id } = parsed.data;
  const results: { url: string; ok: boolean; productId?: string; error?: string }[] = [];

  for (const url of urls) {
    let markdown: string;
    try {
      const fc = await firecrawlScrape(url);
      markdown = fc.markdown;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      results.push({ url, ok: false, error: `[Firecrawl] ${msg}` });
      continue;
    }

    try {
      const draft = await generateProductDraftFromMarkdown(markdown, url);

      const mergedSpecs: Record<string, unknown> = {
        ...draft.specifications,
        import: { source_url: url, via: "firecrawl+vertex", at: new Date().toISOString() },
      };

      const rowCandidate = {
        slug: draft.slug,
        category_id,
        name: draft.name,
        description: draft.description,
        price_usd: draft.price_usd,
        price_cny: draft.price_cny,
        moq: draft.moq,
        stock: draft.stock,
        sku: draft.sku,
        images: draft.images,
        specifications: mergedSpecs,
        tags: draft.tags,
        featured: draft.featured,
        list_status: "draft" as const,
      };

      const validated = productCreateSchema.safeParse(rowCandidate);
      if (!validated.success) {
        results.push({ url, ok: false, error: `[Import] ${validated.error.message}` });
        continue;
      }

      const baseSlug = slugifyBase(validated.data.slug || draft.name);
      const slug = await ensureUniqueProductSlug(supabase, baseSlug);
      const insertRow = { ...validated.data, slug };

      const { data: inserted, error } = await supabase.from("products").insert(insertRow).select("id").single();
      if (error) {
        results.push({ url, ok: false, error: `[Import] ${error.message}` });
        continue;
      }

      await logAdminAction(supabase, {
        adminId: auth.ctx.adminId,
        action: "create",
        tableName: "products",
        recordId: inserted?.id ? String(inserted.id) : null,
        changes: { after: insertRow, source_url: url },
      });

      results.push({ url, ok: true, productId: inserted?.id ? String(inserted.id) : undefined });
    } catch (e) {
      const mapped = mapVertexClientError(e);
      if (mapped) {
        results.push({ url, ok: false, error: mapped.message });
        continue;
      }
      const msg = e instanceof Error ? e.message : "Import failed";
      results.push({ url, ok: false, error: `[Import] ${msg}` });
    }
  }

  return NextResponse.json({ data: { results } }, { status: 200 });
}
