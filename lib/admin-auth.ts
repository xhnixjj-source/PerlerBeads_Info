import { cookies } from "next/headers";

const ADMIN_COOKIE = "perlerhub_admin";

export function isAdminSession() {
  const token = process.env.ADMIN_DASHBOARD_PASSWORD;
  if (!token) return false;
  const current = cookies().get(ADMIN_COOKIE)?.value;
  return current === token;
}

export function adminCookieName() {
  return ADMIN_COOKIE;
}
