/**
 * Creates the first (or additional) admin user in public.admin_users.
 *
 * Usage:
 *   npx tsx scripts/create-admin-user.ts you@example.com your-password super_admin
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (loaded from .env.local / .env like seed_database.ts)
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

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

const ROLES = ["super_admin", "content_admin", "order_admin", "supplier_admin"] as const;

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  const password = process.argv[3];
  const role = process.argv[4]?.trim() as (typeof ROLES)[number] | undefined;

  if (!email || !password || !role) {
    console.error(
      "Usage: npx tsx scripts/create-admin-user.ts <email> <password> <role>\n" +
        `  role: ${ROLES.join(" | ")}`,
    );
    process.exit(1);
  }
  if (!ROLES.includes(role)) {
    console.error(`Invalid role. Use one of: ${ROLES.join(", ")}`);
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, key);
  const password_hash = await bcrypt.hash(password, 12);

  const { data, error } = await supabase
    .from("admin_users")
    .insert({ email, password_hash, role })
    .select("id, email, role")
    .maybeSingle();

  if (error) {
    if (error.code === "23505") {
      console.error("That email already exists. Use Supabase SQL to update password_hash if needed.");
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }

  console.log("Created admin user:", data);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
