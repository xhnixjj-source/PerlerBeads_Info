import { headers } from "next/headers";

/** Build absolute URL for the current request (share links, OG). */
export function absoluteUrl(path: string) {
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!host) return p;
  return `${proto}://${host}${p}`;
}
