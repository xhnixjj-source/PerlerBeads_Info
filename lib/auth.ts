import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import type { AdminRole } from "@/lib/admin/permissions";
import { isAdminRole } from "@/lib/admin/permissions";
import { getNextAuthSecret } from "@/lib/next-auth-secret";

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
          role: String(row.role),
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.role = String(token.role ?? "");
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
