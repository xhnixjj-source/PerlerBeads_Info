import { createClient } from "@supabase/supabase-js";

/** Avoid Next.js Data Cache serving stale Supabase rows after seeding or CMS updates. */
function supabaseServerFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return fetch(input, {
    ...init,
    cache: "no-store",
  });
}

/** Project URL for server-side clients (trimmed; avoids failed reads when env has trailing newline). */
function supabaseProjectUrl(): string | undefined {
  const u =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || process.env.SUPABASE_URL?.trim();
  return u || undefined;
}

/**
 * Which env vars block {@link createSupabaseServiceClient} (for clear 503 messages).
 * URL: `NEXT_PUBLIC_SUPABASE_URL` or server-only `SUPABASE_URL`.
 */
export function missingSupabaseServiceEnv(): string[] {
  const missing: string[] = [];
  if (!supabaseProjectUrl()) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL");
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    missing.push("SUPABASE_SERVICE_ROLE_KEY");
  }
  return missing;
}

export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anon) return null;
  return createClient(url, anon, {
    auth: { persistSession: false },
    global: { fetch: supabaseServerFetch },
  });
}

export function createSupabaseServiceClient() {
  const url = supabaseProjectUrl();
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceRole) return null;
  return createClient(url, serviceRole, {
    auth: { persistSession: false },
    global: { fetch: supabaseServerFetch },
  });
}
