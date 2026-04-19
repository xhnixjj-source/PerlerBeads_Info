import { logAdminAction } from "@/lib/admin/admin-logger";
import { checkAdminAiRateLimit } from "@/lib/admin/ai-rate-limit";
import { jsonError, requireAdminRequest, requireServiceClient } from "@/lib/admin/api-auth";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { canAccess } from "@/lib/admin/permissions";
import { parseJsonBody } from "@/lib/admin/schemas";
import { firecrawlScrape, isFirecrawlConfigured } from "@/lib/firecrawl/client";
import { isVertexConfigured } from "@/lib/vertex-ai/client";
import { mapVertexClientError } from "@/lib/vertex-ai/route-errors";
import { generateBlogPostFromSources } from "@/lib/vertex-ai/blog-generator";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const MAX_SOURCE_URLS = 5;

const bodySchema = z.object({
  urls: z.array(z.string().url()).min(1).max(MAX_SOURCE_URLS),
  keywords: z.array(z.string()).optional().default([]),
  audience: z.string().optional().default(""),
  transcript: z.string().max(50_000).optional(),
});

function slugifyBase(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

async function ensureUniqueBlogSlug(
  supabase: NonNullable<ReturnType<typeof createSupabaseServiceClient>>,
  base: string,
): Promise<string> {
  let slug = base || `post-${Date.now()}`;
  for (let i = 0; i < 60; i++) {
    const trySlug = i === 0 ? slug : `${base}-${i + 1}`;
    const { data } = await supabase.from("blog_posts").select("id").eq("slug", trySlug).maybeSingle();
    if (!data) return trySlug;
  }
  return `${base}-${Date.now()}`;
}

export async function POST(request: Request) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;
  if (!canAccess(auth.ctx.role, "blog", "POST")) {
    return jsonError(403, "Forbidden", "forbidden");
  }
  if (!isVertexConfigured()) {
    return jsonError(503, "Vertex AI not configured (GOOGLE_CLOUD_PROJECT_ID, GOOGLE_CLOUD_LOCATION)", "vertex");
  }
  if (!isFirecrawlConfigured()) {
    return jsonError(503, "Firecrawl not configured (FIRECRAWL_API_KEY)", "firecrawl");
  }

  const rlKey = `blog-sources:${auth.ctx.adminId}`;
  if (!checkAdminAiRateLimit(rlKey, 60_000, 6)) {
    return jsonError(429, "Too many blog-from-sources requests; try again in a minute.", "rate_limit");
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

  const { urls, keywords, audience, transcript } = parsed.data;

  const chunks: string[] = [];
  for (const url of urls) {
    try {
      const { markdown, metadata } = await firecrawlScrape(url);
      const title =
        typeof metadata.title === "string" && metadata.title.trim()
          ? metadata.title.trim()
          : url;
      chunks.push(`## ${title}\n_Source: ${url}_\n\n${markdown}\n\n---\n`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "scrape failed";
      return jsonError(502, `Failed to scrape ${url}: ${msg}`, "firecrawl");
    }
  }

  const combined = chunks.join("\n");

  let generated;
  try {
    generated = await generateBlogPostFromSources(combined, keywords, audience, transcript);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Generation failed";
    console.error("[generate-blog-from-sources]", msg);
    const mapped = mapVertexClientError(e);
    if (mapped) return jsonError(mapped.status, mapped.message, mapped.code);
    return jsonError(502, msg, "vertex");
  }

  const baseSlug = slugifyBase(generated.slug || "from-sources");
  const slug = await ensureUniqueBlogSlug(supabase, baseSlug);

  const promptUsed = `sources=${urls.join(",")}; keywords=${keywords.join(",")}; audience=${audience}`.slice(
    0,
    2000,
  );

  const insertRow = {
    slug,
    title: generated.title,
    content: generated.content,
    excerpt: generated.excerpt,
    seo_title: generated.seo_title,
    seo_description: generated.seo_description,
    seo_keywords: generated.seo_keywords,
    status: "draft" as const,
    ai_generated: true,
    ai_prompt_used: promptUsed,
    published_at: null,
  };

  const { data, error } = await supabase.from("blog_posts").insert(insertRow).select("*").single();
  if (error) {
    console.error("[generate-blog-from-sources insert]", error.message);
    return jsonError(500, error.message, "database");
  }

  await logAdminAction(supabase, {
    adminId: auth.ctx.adminId,
    action: "create",
    tableName: "blog_posts",
    recordId: data?.id ? String(data.id) : null,
    changes: { after: data, generated, source_urls: urls },
  });

  return NextResponse.json({ data: { post: data, preview: generated } }, { status: 201 });
}
