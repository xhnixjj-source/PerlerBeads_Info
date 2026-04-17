/**
 * Upserts demo products into `public.products` (service role).
 *
 * Prerequisites:
 *   - Ecommerce migration applied so `products` has category_id + list_status
 *   - Categories seeded (slugs: perler-beads, wooden-toys, 3d-printing) or matching rows exist
 *
 *   npm run seed:shop
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { SEED_SHOP_PRODUCTS } from "../lib/data/seed-shop-products";

function loadEnvFromFile(fileName: string) {
  const full = resolve(process.cwd(), fileName);
  if (!existsSync(full)) return;
  let text = readFileSync(full, "utf8");
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (process.env[key] !== undefined && process.env[key] !== "") continue;
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

loadEnvFromFile(".env.local");
loadEnvFromFile(".env");

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const missing: string[] = [];
  if (!url?.trim()) missing.push("NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)");
  if (!serviceKey?.trim()) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (missing.length) {
    console.error("Missing:\n  - " + missing.join("\n  - "));
    process.exit(1);
  }

  const supabase = createClient(url!.trim(), serviceKey!.trim(), { auth: { persistSession: false } });

  const { data: cats, error: catErr } = await supabase.from("categories").select("id, slug");
  if (catErr || !cats?.length) {
    console.error("Could not load categories:", catErr?.message ?? "empty");
    console.error("Run the ecommerce migration and ensure categories exist (perler-beads, wooden-toys, 3d-printing).");
    process.exit(1);
  }

  const slugToId = new Map(cats.map((c) => [String(c.slug), String(c.id)]));

  const rows = SEED_SHOP_PRODUCTS.map((p) => {
    const categoryId = slugToId.get(p.categorySlug);
    if (!categoryId) {
      throw new Error(
        `Missing category slug "${p.categorySlug}". Available: ${Array.from(slugToId.keys()).join(", ")}`,
      );
    }
    return {
      slug: p.slug,
      category_id: categoryId,
      name: p.name,
      description: p.description,
      price_usd: p.priceUsd,
      stock: p.stock,
      sku: p.sku,
      moq: p.moq,
      images: p.images,
      specifications: p.specifications,
      tags: p.tags,
      featured: p.featured,
      list_status: p.listStatus,
    };
  });

  const { data, error } = await supabase.from("products").upsert(rows, { onConflict: "slug" }).select("slug");

  if (error) {
    console.error("products upsert failed:", error.message);
    console.error(error);
    process.exit(1);
  }

  console.log("Shop demo products upserted:", data?.length ?? 0, "rows (onConflict: slug)");
  for (const r of data ?? []) {
    console.log("  -", r.slug);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
