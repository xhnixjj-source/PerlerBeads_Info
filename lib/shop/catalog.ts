import { createSupabaseServerClient } from "@/lib/supabase/server";

export type StoreCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type StoreProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_usd: number | null;
  stock: number;
  images: unknown;
  category: { slug: string; name: string } | null;
};

function normalizeCategoryEmbed(raw: unknown): { slug: string; name: string } | null {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const o = raw as { slug?: unknown; name?: unknown };
    return { slug: String(o.slug ?? ""), name: String(o.name ?? "") };
  }
  if (Array.isArray(raw) && raw[0]) {
    return normalizeCategoryEmbed(raw[0]);
  }
  return null;
}

export async function loadStoreCategories(): Promise<StoreCategoryRow[]> {
  const sb = createSupabaseServerClient();
  if (!sb) return [];
  const { data, error } = await sb
    .from("categories")
    .select("id,name,slug,description")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("[shop] categories", error.message);
    return [];
  }
  return (data ?? []) as StoreCategoryRow[];
}

export async function loadStoreProducts(categorySlug?: string): Promise<StoreProductRow[]> {
  const sb = createSupabaseServerClient();
  if (!sb) return [];
  const { data, error } = await sb
    .from("products")
    .select("id,slug,name,description,price_usd,stock,images, category:categories(slug,name)")
    .eq("list_status", "published");
  if (error) {
    console.error("[shop] products", error.message);
    return [];
  }
  const rows = (data ?? []).map((row) => {
    const r = row as Record<string, unknown>;
    return {
      ...r,
      category: normalizeCategoryEmbed(r.category),
    } as StoreProductRow;
  });
  if (!categorySlug?.trim()) return rows;
  const s = categorySlug.trim().toLowerCase();
  return rows.filter((r) => (r.category?.slug ?? "").toLowerCase() === s);
}

export async function loadStoreProductBySlug(slug: string): Promise<StoreProductRow | null> {
  const sb = createSupabaseServerClient();
  if (!sb) return null;
  const { data, error } = await sb
    .from("products")
    .select("id,slug,name,description,price_usd,stock,images, category:categories(slug,name)")
    .eq("slug", slug)
    .eq("list_status", "published")
    .maybeSingle();
  if (error) {
    console.error("[shop] product by slug", error.message);
    return null;
  }
  if (!data) return null;
  const r = data as Record<string, unknown>;
  return {
    ...r,
    category: normalizeCategoryEmbed(r.category),
  } as StoreProductRow;
}

export function firstImageUrl(images: unknown): string | null {
  if (!Array.isArray(images) || images.length === 0) return null;
  const first = images[0];
  if (typeof first === "string" && first.trim()) return first.trim();
  return null;
}
