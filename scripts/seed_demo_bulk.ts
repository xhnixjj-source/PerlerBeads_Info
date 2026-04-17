/**
 * Inserts 20 synthetic `patterns` + 20 synthetic `suppliers` for UI demos.
 * Slugs: `bulk-pattern-001` … `bulk-pattern-020`, `bulk-supplier-001` … `bulk-supplier-020`
 * (won't overwrite hand-seeded rows from `npm run seed`).
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) + SUPABASE_SERVICE_ROLE_KEY
 *
 * Optional: DEMO_BULK_COUNT=25 npx tsx scripts/seed_demo_bulk.ts
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { buildBulkPatterns, buildBulkSuppliers } from "../lib/data/demo-bulk-generators";

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

function parseCount(): number {
  const raw = process.env.DEMO_BULK_COUNT ?? "20";
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1 || n > 200) return 20;
  return n;
}

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

  const count = parseCount();
  const patterns = buildBulkPatterns(count);
  const suppliers = buildBulkSuppliers(count);

  const supabaseUrl = url!.trim();
  const supabaseKey = serviceKey!.trim();
  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

  const patternRows = patterns.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    image_url: p.image_url,
    difficulty: p.difficulty,
    peg_width: p.peg_width,
    peg_height: p.peg_height,
    bead_count: p.bead_count,
    colors_required: p.colors_required,
    tags: p.tags,
    seo_title: p.seo_title ?? null,
    seo_description: p.seo_description ?? null,
  }));

  const { data: pData, error: pErr } = await supabase
    .from("patterns")
    .upsert(patternRows, { onConflict: "slug" })
    .select("slug");

  if (pErr) {
    console.error("patterns upsert failed:", pErr.message);
    process.exit(1);
  }

  const supplierRows = suppliers.map((s) => ({
    slug: s.slug,
    company_name: s.company_name,
    description: s.description,
    location: s.location,
    factory_type: s.factory_type,
    moq: s.moq,
    lead_time: s.lead_time,
    accepted_payment: s.accepted_payment,
    is_verified: s.is_verified,
    contact_email: s.contact_email,
    website: s.website,
    main_products: s.main_products,
    certification_badges: s.certification_badges,
    gallery_urls: s.gallery_urls,
  }));

  const { data: sData, error: sErr } = await supabase
    .from("suppliers")
    .upsert(supplierRows, { onConflict: "slug" })
    .select("slug");

  if (sErr) {
    console.error("suppliers upsert failed:", sErr.message);
    process.exit(1);
  }

  console.log(`Upserted ${pData?.length ?? 0} patterns and ${sData?.length ?? 0} suppliers (count=${count}).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
