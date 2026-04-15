import { NextResponse } from "next/server";
import { adminCookieName } from "@/lib/admin-auth";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

type Status = "New" | "Contacted" | "Closed";

function validateStatus(value: unknown): value is Status {
  return value === "New" || value === "Contacted" || value === "Closed";
}

export async function POST(request: Request, context: { params: { id: string } }) {
  const token = process.env.ADMIN_DASHBOARD_PASSWORD;
  const cookieHeader = request.headers.get("cookie") || "";
  const expected = `${adminCookieName()}=${token}`;
  if (!token || !cookieHeader.includes(expected)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
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

  const supabase = createSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Supabase not configured" }, { status: 500 });
  }

  const { error } = await supabase
    .from("inquiries")
    .update({ status: body.status })
    .eq("id", context.params.id);
  if (error) {
    return NextResponse.json({ ok: false, error: "Update failed" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
