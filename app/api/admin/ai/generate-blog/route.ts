import { logAdminAction } from "@/lib/admin/admin-logger";
import { jsonError, requireAdminRequest, requireServiceClient } from "@/lib/admin/api-auth";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { canAccess } from "@/lib/admin/permissions";
import { generateBlogPost } from "@/lib/vertex-ai/blog-generator";
import { isVertexConfigured } from "@/lib/vertex-ai/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = {
  topic?: string;
  keywords?: string[];
  audience?: string;
};

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

  const svc = requireServiceClient();
  if (!svc.ok) return svc.response;
  const { supabase } = svc;

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return jsonError(400, "Invalid JSON", "bad_request");
  }

  const topic = String(body.topic ?? "").trim();
  if (!topic) {
    return jsonError(400, "topic is required", "validation");
  }
  const keywords = Array.isArray(body.keywords) ? body.keywords.map((k) => String(k)) : [];
  const audience = String(body.audience ?? "").trim();

  let generated;
  try {
    generated = await generateBlogPost(topic, keywords, audience);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Generation failed";
    console.error("[generate-blog]", msg);
    return jsonError(502, msg, "vertex");
  }

  const baseSlug = slugifyBase(generated.slug || topic);
  const slug = await ensureUniqueBlogSlug(supabase, baseSlug);

  const promptUsed = `topic=${topic}; keywords=${keywords.join(",")}; audience=${audience}`.slice(0, 2000);

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
    console.error("[generate-blog insert]", error.message);
    return jsonError(500, error.message, "database");
  }

  await logAdminAction(supabase, {
    adminId: auth.ctx.adminId,
    action: "create",
    tableName: "blog_posts",
    recordId: data?.id ? String(data.id) : null,
    changes: { after: data, generated },
  });

  return NextResponse.json({ data: { post: data, preview: generated } }, { status: 201 });
}
