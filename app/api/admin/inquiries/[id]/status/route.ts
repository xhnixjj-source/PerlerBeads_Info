import { jsonError, requireAdminRequest, requireServiceClient } from "@/lib/admin/api-auth";
import { canAccess } from "@/lib/admin/permissions";
import { NextResponse } from "next/server";

type Status = "New" | "Contacted" | "Closed";

function validateStatus(value: unknown): value is Status {
  return value === "New" || value === "Contacted" || value === "Closed";
}

export async function POST(request: Request, context: { params: { id: string } }) {
  const auth = await requireAdminRequest();
  if (!auth.ok) return auth.response;
  if (!canAccess(auth.ctx.role, "inquiries", "POST")) {
    return jsonError(403, "Forbidden", "forbidden");
  }

  let body: { status?: Status };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  if (!validateStatus(body.status)) {
    return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 400 });
  }

  const svc = requireServiceClient();
  if (!svc.ok) return svc.response;
  const { supabase } = svc;

  const { error } = await supabase
    .from("inquiries")
    .update({ status: body.status })
    .eq("id", context.params.id);
  if (error) {
    return NextResponse.json({ ok: false, error: "Update failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
