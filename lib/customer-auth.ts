import type { SupabaseClient } from "@supabase/supabase-js";

type OAuthProfile = {
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

/**
 * Upsert storefront customer on OAuth sign-in. Returns the persisted row id.
 */
export async function upsertCustomerFromOAuth(
  supabase: SupabaseClient,
  params: {
    email: string;
    profile: OAuthProfile;
    provider: string;
    providerAccountId: string;
    refreshToken?: string | null;
    accessToken?: string | null;
    expiresAt?: number | null;
    tokenType?: string | null;
    scope?: string | null;
    idToken?: string | null;
  },
): Promise<{ id: string } | null> {
  const email = params.email.trim().toLowerCase();
  if (!email) return null;

  const { data: existing, error: findErr } = await supabase
    .from("customer_users")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (findErr) {
    console.error("[customer] lookup", findErr.message);
    return null;
  }

  const patch = {
    email,
    name: params.profile.name ?? null,
    image: params.profile.image ?? null,
    email_verified: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  let userId: string;
  if (existing?.id) {
    userId = String(existing.id);
    const { error: upErr } = await supabase.from("customer_users").update(patch).eq("id", userId);
    if (upErr) {
      console.error("[customer] update", upErr.message);
      return null;
    }
  } else {
    const { data: inserted, error: insErr } = await supabase
      .from("customer_users")
      .insert({
        email,
        name: params.profile.name ?? null,
        image: params.profile.image ?? null,
        email_verified: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (insErr || !inserted?.id) {
      console.error("[customer] insert", insErr?.message);
      return null;
    }
    userId = String(inserted.id);
  }

  const { error: accErr } = await supabase.from("customer_accounts").upsert(
    {
      user_id: userId,
      type: "oauth",
      provider: params.provider,
      provider_account_id: params.providerAccountId,
      refresh_token: params.refreshToken ?? null,
      access_token: params.accessToken ?? null,
      expires_at: params.expiresAt ?? null,
      token_type: params.tokenType ?? null,
      scope: params.scope ?? null,
      id_token: params.idToken ?? null,
    },
    { onConflict: "provider,provider_account_id" },
  );
  if (accErr) {
    console.error("[customer] account upsert", accErr.message);
  }

  return { id: userId };
}
