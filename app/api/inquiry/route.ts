import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Body = {
  name?: string;
  email?: string;
  message?: string;
  source?: string;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();
  const source = body.source?.trim() || "home";

  if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(message)) {
    return NextResponse.json(
      { ok: false, error: "name, email, and message are required" },
      { status: 400 }
    );
  }

  if (email.length > 320 || name.length > 200 || message.length > 8000) {
    return NextResponse.json({ ok: false, error: "Field too long" }, { status: 400 });
  }

  try {
    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from("inquiries").insert({
      name,
      email,
      message,
      source,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 500 });
  }
}
