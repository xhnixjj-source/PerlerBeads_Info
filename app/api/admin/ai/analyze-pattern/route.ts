import { jsonError, requireAdminRequest } from "@/lib/admin/api-auth";
import { jsonData } from "@/lib/admin/http";
import { canAccess } from "@/lib/admin/permissions";
import { analyzePatternImage, analyzePatternImageBuffer } from "@/lib/vertex-ai/pattern-analyzer";
import { mapVertexClientError } from "@/lib/vertex-ai/route-errors";
import { isVertexConfigured } from "@/lib/vertex-ai/client";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;
  if (!canAccess(auth.ctx.role, "patterns", "PUT")) {
    return jsonError(403, "Forbidden", "forbidden");
  }
  if (!isVertexConfigured()) {
    return jsonError(503, "Vertex AI not configured (GOOGLE_CLOUD_PROJECT_ID, GOOGLE_CLOUD_LOCATION)", "vertex");
  }

  const contentType = request.headers.get("content-type") || "";

  try {
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file");
      if (!file || !(file instanceof File)) {
        return jsonError(400, "Missing file field `file`", "validation");
      }
      const buf = Buffer.from(await file.arrayBuffer());
      const mime = file.type || "image/png";
      const metadata = await analyzePatternImageBuffer(buf, mime);
      const beadSum = metadata.colors_required.reduce((a, c) => a + c.count, 0);
      if (!metadata.estimated_bead_count && beadSum) {
        metadata.estimated_bead_count = beadSum;
      }
      return jsonData({ metadata, source: "upload" });
    }

    let body: { imageUrl?: string };
    try {
      body = (await request.json()) as { imageUrl?: string };
    } catch {
      return jsonError(400, "Invalid JSON", "bad_request");
    }
    const imageUrl = String(body.imageUrl ?? "").trim();
    if (!imageUrl) {
      return jsonError(400, "imageUrl is required for JSON requests", "validation");
    }

    const metadata = await analyzePatternImage(imageUrl);
    const beadSum = metadata.colors_required.reduce((a, c) => a + c.count, 0);
    if (!metadata.estimated_bead_count && beadSum) {
      metadata.estimated_bead_count = beadSum;
    }
    return jsonData({ metadata, source: "url" });
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    const msg = err.message || "Analysis failed";
    const cause = err.cause instanceof Error ? err.cause.message : err.cause != null ? String(err.cause) : "";
    console.error("[analyze-pattern]", msg, cause ? `cause=${cause}` : "");

    const mapped = mapVertexClientError(e);
    if (mapped) return jsonError(mapped.status, mapped.message, mapped.code);

    return jsonError(502, msg, "vertex");
  }
}
