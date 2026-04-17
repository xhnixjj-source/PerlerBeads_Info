import { logAdminAction } from "@/lib/admin/admin-logger";
import { jsonError, requireAdminRequest, requireServiceClient } from "@/lib/admin/api-auth";
import { jsonData } from "@/lib/admin/http";
import { canAccess } from "@/lib/admin/permissions";

const BUCKET = "admin-uploads";

export async function POST(request: Request) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;
  if (!canAccess(auth.ctx.role, "upload", "POST")) {
    return jsonError(403, "Forbidden", "forbidden");
  }
  const svc = requireServiceClient();
  if (!svc.ok) return svc.response;
  const { supabase } = svc;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonError(400, "Expected multipart form data", "bad_request");
  }

  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return jsonError(400, "Missing file field `file`", "validation");
  }
  if (file.size <= 0) {
    return jsonError(400, "Empty file", "validation");
  }
  const maxBytes = 8 * 1024 * 1024;
  if (file.size > maxBytes) {
    return jsonError(400, "File too large (max 8MB)", "validation");
  }

  const original = file.name || "upload.bin";
  const ext = original.includes(".") ? original.split(".").pop()!.toLowerCase().slice(0, 8) : "bin";
  const safeExt = ext.replace(/[^a-z0-9]/g, "") || "bin";
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 12)}.${safeExt}`;

  const buf = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || "application/octet-stream";

  const { error } = await supabase.storage.from(BUCKET).upload(path, buf, {
    contentType,
    upsert: false,
  });

  if (error) {
    console.error("[admin upload]", error.message);
    return jsonError(500, error.message, "storage");
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);

  await logAdminAction(supabase, {
    adminId: auth.ctx.adminId,
    action: "create",
    tableName: "storage",
    recordId: null,
    changes: { bucket: BUCKET, path, publicUrl: pub.publicUrl },
  });

  return jsonData({ url: pub.publicUrl, path, bucket: BUCKET });
}
