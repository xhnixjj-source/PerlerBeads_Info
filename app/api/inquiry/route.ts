import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Body = {
  name?: string;
  email?: string;
  company?: string;
  quantity?: string;
  message?: string;
  source?: string;
  supplierId?: string;
  website?: string;
  elapsedMs?: number;
};

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const rateBucket = new Map<string, { count: number; startAt: number }>();

function ipFromRequest(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function enforceRateLimit(ip: string) {
  const now = Date.now();
  const current = rateBucket.get(ip);
  if (!current || now - current.startAt > RATE_LIMIT_WINDOW_MS) {
    rateBucket.set(ip, { count: 1, startAt: now });
    return true;
  }
  if (current.count >= RATE_LIMIT_MAX) return false;
  current.count += 1;
  return true;
}

async function notifyByEmail(payload: {
  name: string;
  email: string;
  message: string;
  company?: string;
  quantity?: string;
  source: string;
  supplierId?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_NOTIFY_EMAIL;
  if (!apiKey || !to) return;
  const from = process.env.INQUIRY_FROM_EMAIL || "PerlerHub <onboarding@resend.dev>";
  const subject = `[PerlerHub] New inquiry from ${payload.name}`;
  const html = `
    <h2>New inquiry received</h2>
    <p><strong>Name:</strong> ${payload.name}</p>
    <p><strong>Email:</strong> ${payload.email}</p>
    <p><strong>Company:</strong> ${payload.company || "-"}</p>
    <p><strong>Quantity:</strong> ${payload.quantity || "-"}</p>
    <p><strong>Source:</strong> ${payload.source}</p>
    <p><strong>Supplier ID:</strong> ${payload.supplierId || "-"}</p>
    <p><strong>Message:</strong></p>
    <pre>${payload.message}</pre>
  `;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
    }),
  });
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
  const company = body.company?.trim();
  const quantity = body.quantity?.trim();
  const message = body.message?.trim();
  const source = body.source?.trim() || "home";
  const supplierId = body.supplierId?.trim() || null;
  const website = body.website?.trim();
  const elapsedMs = body.elapsedMs;

  if (website) {
    return NextResponse.json({ ok: true, success: true });
  }
  if (typeof elapsedMs === "number" && elapsedMs < 1500) {
    return NextResponse.json({ ok: false, error: "Too fast" }, { status: 400 });
  }
  if (!enforceRateLimit(ipFromRequest(request))) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }

  if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(message)) {
    return NextResponse.json(
      { ok: false, error: "name, email, and message are required" },
      { status: 400 }
    );
  }

  if (
    email.length > 320 ||
    name.length > 200 ||
    message.length > 8000 ||
    (company && company.length > 200) ||
    (quantity && quantity.length > 120)
  ) {
    return NextResponse.json({ ok: false, error: "Field too long" }, { status: 400 });
  }

  try {
    const supabase = createSupabaseAdmin();
    const { error } = await supabase.from("inquiries").insert({
      name,
      email,
      company: company || null,
      quantity: quantity || null,
      message,
      source,
      supplier_id: supplierId,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 });
    }

    try {
      await notifyByEmail({
        name,
        email,
        message,
        company: company || undefined,
        quantity: quantity || undefined,
        source,
        supplierId: supplierId || undefined,
      });
    } catch (notifyError) {
      console.error("Inquiry notification failed:", notifyError);
    }

    return NextResponse.json({ ok: true, success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 500 });
  }
}
