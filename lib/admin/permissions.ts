export type AdminRole = "super_admin" | "content_admin" | "order_admin" | "supplier_admin";

export const ADMIN_ROLES: readonly AdminRole[] = [
  "super_admin",
  "content_admin",
  "order_admin",
  "supplier_admin",
];

export function isAdminRole(s: string): s is AdminRole {
  return (ADMIN_ROLES as readonly string[]).includes(s);
}

export type AdminContext = {
  adminId: string;
  role: AdminRole;
};

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

/** Resource keys used by admin APIs */
export type AdminResource =
  | "suppliers"
  | "products"
  | "patterns"
  | "orders"
  | "inquiries"
  | "blog"
  | "settings"
  | "upload"
  | "users";

/**
 * Returns whether `role` may perform `method` on `resource`.
 * - GET: read
 * - POST / PUT / DELETE: write (delete included)
 */
export function canAccess(role: AdminRole, resource: AdminResource, method: HttpMethod): boolean {
  const read = method === "GET";
  const write = method === "POST" || method === "PUT" || method === "DELETE";

  if (resource === "users") {
    return role === "super_admin";
  }

  if (role === "super_admin") return true;

  if (read) {
    return true;
  }

  if (!write) return false;

  switch (role) {
    case "content_admin":
      return ["patterns", "blog", "products", "upload"].includes(resource);
    case "order_admin":
      return ["orders", "inquiries", "upload"].includes(resource);
    case "supplier_admin":
      return ["suppliers", "products", "upload"].includes(resource);
    default:
      return false;
  }
}

export function canManageUsers(role: AdminRole): boolean {
  return role === "super_admin";
}

/** Settings PUT restricted to super_admin in route handler; others get 403. */
export function canWriteSettings(role: AdminRole): boolean {
  return role === "super_admin";
}

/** Which sidebar links to show for each role (UX; API still enforces `canAccess`). */
export function adminNavHrefsForRole(role: AdminRole): Set<string> {
  const dash = "/admin/dashboard";
  const base = new Set<string>([dash]);
  if (role === "super_admin") {
    return new Set([
      dash,
      "/admin/suppliers",
      "/admin/products",
      "/admin/patterns",
      "/admin/orders",
      "/admin/inquiries",
      "/admin/blog",
      "/admin/ai",
      "/admin/settings",
      "/admin/users",
    ]);
  }
  if (role === "content_admin") {
    ["/admin/products", "/admin/patterns", "/admin/blog", "/admin/ai"].forEach((h) => base.add(h));
    return base;
  }
  if (role === "order_admin") {
    ["/admin/orders", "/admin/inquiries"].forEach((h) => base.add(h));
    return base;
  }
  if (role === "supplier_admin") {
    ["/admin/suppliers", "/admin/products"].forEach((h) => base.add(h));
    return base;
  }
  return base;
}
