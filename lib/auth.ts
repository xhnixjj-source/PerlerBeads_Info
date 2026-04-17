import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { upsertCustomerFromOAuth } from "@/lib/customer-auth";
import type { AdminRole } from "@/lib/admin/permissions";
import { isAdminRole } from "@/lib/admin/permissions";
import { getNextAuthSecret } from "@/lib/next-auth-secret";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

// #region agent log
function debugAuthLog(payload: {
  hypothesisId: string;
  message: string;
  data: Record<string, unknown>;
  location: string;
  runId?: string;
}) {
  fetch("http://127.0.0.1:7722/ingest/fe92ae1a-8de2-4083-b267-ba230f14e8ca", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "8b42ff",
    },
    body: JSON.stringify({
      sessionId: "8b42ff",
      runId: payload.runId,
      hypothesisId: payload.hypothesisId,
      location: payload.location,
      message: payload.message,
      data: payload.data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
}
// #endregion

const googleConfigured =
  Boolean(process.env.GOOGLE_CLIENT_ID?.trim()) && Boolean(process.env.GOOGLE_CLIENT_SECRET?.trim());
const facebookConfigured =
  Boolean(process.env.FACEBOOK_CLIENT_ID?.trim()) && Boolean(process.env.FACEBOOK_CLIENT_SECRET?.trim());

/** openid-client default is 3500ms; Google discovery can be slow across regions. */
const oauthHttpTimeoutMs = Math.max(
  3500,
  Number.parseInt(process.env.OAUTH_HTTP_TIMEOUT_MS ?? "20000", 10) || 20000,
);
const oauthHttpOptions = { timeout: oauthHttpTimeoutMs };

// #region agent log
debugAuthLog({
  hypothesisId: "H4",
  message: "auth_env_flags",
  location: "lib/auth.ts:module_init",
  data: {
    googleConfigured,
    facebookConfigured,
    hasNextAuthUrl: Boolean(process.env.NEXTAUTH_URL?.trim()),
    oauthHttpTimeoutMs,
    nodeEnv: process.env.NODE_ENV,
  },
});
// #endregion

// #region agent log
void (async () => {
  const hosts = ["oauth2.googleapis.com", "accounts.google.com"] as const;
  const dns = await import("dns/promises");
  for (const hostname of hosts) {
    try {
      const records = await dns.lookup(hostname, { all: true });
      debugAuthLog({
        hypothesisId: "H2",
        message: "dns_lookup_ok",
        location: "lib/auth.ts:dns_probe",
        data: { hostname, records },
      });
    } catch (e) {
      debugAuthLog({
        hypothesisId: "H2",
        message: "dns_lookup_fail",
        location: "lib/auth.ts:dns_probe",
        data: {
          hostname,
          errName: e instanceof Error ? e.name : "unknown",
          errMessage: e instanceof Error ? e.message.slice(0, 200) : String(e).slice(0, 200),
        },
      });
    }
  }
})();
// #endregion

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (!email || !password) return null;

        const supabase = createSupabaseServiceClient();
        if (!supabase) {
          console.error("[auth] Supabase service client not configured");
          return null;
        }

        const { data: row, error } = await supabase
          .from("admin_users")
          .select("id, email, password_hash, role")
          .eq("email", email)
          .maybeSingle();

        if (error || !row?.password_hash || !row.role) {
          return null;
        }

        if (!isAdminRole(String(row.role))) return null;

        const ok = await bcrypt.compare(password, String(row.password_hash));
        if (!ok) return null;

        void supabase
          .from("admin_users")
          .update({ last_login: new Date().toISOString() })
          .eq("id", row.id)
          .then(() => {});

        return {
          id: String(row.id),
          email: String(row.email),
          role: String(row.role) as AdminRole,
        };
      },
    }),
    ...(googleConfigured
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            httpOptions: oauthHttpOptions,
          }),
        ]
      : []),
    ...(facebookConfigured
      ? [
          FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
            httpOptions: oauthHttpOptions,
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },
  pages: {
    signIn: "/login",
  },
  // #region agent log
  logger: {
    warn(code) {
      console.warn("[next-auth]", code);
    },
    debug(code, meta) {
      if (process.env.NODE_ENV === "development") console.debug("[next-auth]", code, meta);
    },
    error(code, metadata) {
      console.error("[next-auth]", code, metadata);
      const m = metadata as Record<string, unknown> | undefined;
      const nested = m?.error as { message?: string; stack?: string; name?: string } | undefined;
      const stack = nested?.stack ?? (metadata instanceof Error ? metadata.stack : "") ?? "";
      const msg = nested?.message ?? (metadata instanceof Error ? metadata.message : "") ?? "";
      const combined = `${msg}\n${stack}`;
      const timedOut = /ETIMEDOUT|timeout/i.test(combined);
      const aggregate = /AggregateError/i.test(stack);
      debugAuthLog({
        hypothesisId: timedOut ? "H1" : aggregate ? "H3" : "H_other",
        message: "nextauth_logger_error",
        location: "lib/auth.ts:logger.error",
        data: {
          code: String(code),
          providerId: typeof m?.providerId === "string" ? m.providerId : undefined,
          errName: nested?.name,
          errMessageSnippet: (nested?.message ?? "").slice(0, 120),
          stackSnippet: stack.slice(0, 400),
          aggregateErrorShape: aggregate,
        },
      });
    },
  },
  // #endregion
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && isAdminRole(String((user as { role?: string }).role ?? ""))) {
        token.id = user.id;
        token.role = user.role;
        token.kind = "admin";
        return token;
      }

      if (account && account.provider !== "credentials" && user?.email) {
        const supabase = createSupabaseServiceClient();
        if (!supabase) {
          console.error("[auth] OAuth sign-in: Supabase service client not configured");
          return token;
        }
        const row = await upsertCustomerFromOAuth(supabase, {
          email: user.email,
          profile: { name: user.name, image: user.image },
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refreshToken: account.refresh_token,
          accessToken: account.access_token,
          expiresAt: account.expires_at ?? undefined,
          tokenType: account.token_type,
          scope: account.scope,
          idToken: account.id_token,
        });
        if (row) {
          token.id = row.id;
          token.role = "customer";
          token.kind = "customer";
        }
        return token;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.role = String(token.role ?? "");
        session.user.kind = token.kind;
      }
      return session;
    },
  },
  secret: getNextAuthSecret(),
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.AUTH_COOKIE_DOMAIN || undefined,
      },
    },
  },
};
