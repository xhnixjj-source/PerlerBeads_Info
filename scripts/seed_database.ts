/**
 * Seeds `public.patterns` and `public.suppliers` from `lib/data/seed-catalog.ts`
 * using the Supabase service role key (bypasses RLS).
 *
 * Env (from process.env or `.env` / `.env.local` in project root):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { SEED_PATTERNS, SEED_SUPPLIERS } from "../lib/data/seed-catalog";

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
    console.error("Missing environment variables:\n  - " + missing.join("\n  - "));
    console.error(
      "\nAdd them to .env.local in the project root (same folder as package.json).\n" +
        "The service role key is under Supabase Dashboard → Project Settings → API →\n" +
        '"Project API keys" → service_role (secret). Do not commit it or expose it in the browser.',
    );
    process.exit(1);
  }

  const supabaseUrl = url!.trim();
  const supabaseKey = serviceKey!.trim();
  const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

  const patternRows = SEED_PATTERNS.map((p) => ({
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
    ...(p.created_at ? { created_at: p.created_at } : {}),
  }));

  const { data: patData, error: patError } = await supabase
    .from("patterns")
    .upsert(patternRows, { onConflict: "slug" })
    .select("slug");

  if (patError) {
    console.error("patterns upsert failed:", patError.message);
    process.exit(1);
  }
  console.log("patterns:", patData?.length ?? 0, "rows upserted by slug");

  const supplierRows = SEED_SUPPLIERS.map((s) => ({
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

  const { data: supData, error: supError } = await supabase
    .from("suppliers")
    .upsert(supplierRows, { onConflict: "slug" })
    .select("slug");

  if (supError) {
    console.error("suppliers upsert failed:", supError.message);
    process.exit(1);
  }
  console.log("suppliers:", supData?.length ?? 0, "rows upserted by slug");
  console.log("Seed completed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
