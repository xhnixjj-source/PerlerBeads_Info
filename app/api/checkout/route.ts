import { authOptions } from "@/lib/auth";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";

export const runtime = "nodejs";

const lineSchema = z.object({
  productId: z.string().uuid(),
  qty: z.coerce.number().int().positive(),
  unitPriceUsd: z.coerce.number().nonnegative(),
});

const shippingSchema = z.object({
  fullName: z.string().min(1).max(200),
  line1: z.string().min(1).max(300),
  city: z.string().min(1).max(120),
  postalCode: z.string().min(1).max(40),
  country: z.string().min(1).max(120),
  email: z.string().max(200).optional(),
});

const bodySchema = z.object({
  items: z.array(lineSchema).min(1),
  shipping: shippingSchema,
});

function roundMoney(n: number) {
  return Math.round(n * 100) / 100;
}

export async function POST(request: Request) {
  const supabase = createSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Server not configured" }, { status: 503 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const userId =
    session?.user?.kind === "customer" && session.user.id && /^[0-9a-f-]{36}$/i.test(session.user.id)
      ? session.user.id
      : null;

  const { items, shipping } = parsed.data;

  // Simulated payment delay
  await new Promise((r) => setTimeout(r, 800));

  let serverTotal = 0;
  const resolved: { productId: string; qty: number; unit: number }[] = [];

  for (const line of items) {
    const { data: row, error } = await supabase
      .from("products")
      .select("id, stock, price_usd, list_status")
      .eq("id", line.productId)
      .maybeSingle();
    if (error || !row) {
      return NextResponse.json({ ok: false, error: "Product not found" }, { status: 400 });
    }
    if (String(row.list_status) !== "published") {
      return NextResponse.json({ ok: false, error: "Product not available" }, { status: 400 });
    }
    const stock = Number(row.stock ?? 0);
    if (!Number.isFinite(stock) || stock < line.qty) {
      return NextResponse.json({ ok: false, error: "Insufficient stock", productId: line.productId }, { status: 400 });
    }
    const dbPrice = roundMoney(Number(row.price_usd ?? 0));
    if (Math.abs(dbPrice - roundMoney(line.unitPriceUsd)) > 0.02) {
      return NextResponse.json({ ok: false, error: "Price changed — refresh and try again." }, { status: 409 });
    }
    serverTotal += dbPrice * line.qty;
    resolved.push({ productId: line.productId, qty: line.qty, unit: dbPrice });
  }

  serverTotal = roundMoney(serverTotal);
  const orderNumber = `SHOP-${randomUUID()}`;

  const { data: orderRow, error: orderErr } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      pattern_id: null,
      total_price: serverTotal,
      amount_total: Math.round(serverTotal * 100),
      currency: "usd",
      status: "Paid",
      order_type: "shop",
      user_id: userId,
      shipping_address: {
        ...shipping,
        email: shipping.email?.trim() ? shipping.email.trim() : null,
      },
    })
    .select("id")
    .single();

  if (orderErr || !orderRow?.id) {
    console.error("[checkout] order insert", orderErr?.message);
    return NextResponse.json({ ok: false, error: "Could not create order" }, { status: 500 });
  }

  const orderId = String(orderRow.id);

  const itemRows = resolved.map((r) => ({
    order_id: orderId,
    product_id: r.productId,
    quantity: r.qty,
    unit_price: r.unit,
  }));

  const { error: itemsErr } = await supabase.from("order_items").insert(itemRows);
  if (itemsErr) {
    console.error("[checkout] order_items", itemsErr.message);
    return NextResponse.json({ ok: false, error: "Could not save line items" }, { status: 500 });
  }

  for (const r of resolved) {
    const { data: p } = await supabase.from("products").select("stock").eq("id", r.productId).maybeSingle();
    const cur = Number(p?.stock ?? 0);
    const next = Math.max(0, cur - r.qty);
    const { error: stErr } = await supabase.from("products").update({ stock: next }).eq("id", r.productId);
    if (stErr) {
      console.error("[checkout] stock update", stErr.message);
    }
  }

  return NextResponse.json({ ok: true, orderId, orderNumber, total: serverTotal });
}
