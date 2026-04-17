import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { createSupabaseServiceClient, missingSupabaseServiceEnv } from "@/lib/supabase/server";

export const runtime = "nodejs";

const KIT_PRICE_CENTS = 999;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 8;
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

type Body = {
  patternId?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const patternId = body.patternId?.trim() ?? "";
  if (!patternId || !UUID_RE.test(patternId)) {
    return NextResponse.json({ ok: false, error: "Invalid pattern id" }, { status: 400 });
  }

  if (!enforceRateLimit(ipFromRequest(request))) {
    return NextResponse.json({ ok: false, error: "Too many requests" }, { status: 429 });
  }

  const supabase = createSupabaseServiceClient();
  if (!supabase) {
    const missing = missingSupabaseServiceEnv();
    return NextResponse.json(
      {
        ok: false,
        error: `Server misconfiguration: missing ${missing.join(" and ")}. Set them in Vercel (Production) for pre-orders; redeploy after saving.`,
      },
      { status: 503 },
    );
  }

  const stripe_session_id = `prep_${randomUUID()}`;

  const { error } = await supabase.from("orders").insert({
    stripe_session_id,
    pattern_id: patternId,
    amount_total: KIT_PRICE_CENTS,
    currency: "usd",
    status: "Pending",
  });

  if (error) {
    console.error("orders prep insert:", error);
    const hint =
      error.message?.includes("violates check constraint") || error.code === "23514"
        ? "Run supabase/migrations/20260417000001_orders_status_pending.sql so status Pending is allowed."
        : undefined;
    return NextResponse.json(
      { ok: false, error: "Could not save order", hint },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, stripe_session_id });
}
