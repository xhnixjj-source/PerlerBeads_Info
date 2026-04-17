import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Pattern, Difficulty, ColorRequirement } from "@/lib/types/pattern";
import type { Supplier } from "@/lib/types/supplier";
import type { Creator } from "@/lib/types/creator";

const fallbackCreators: Creator[] = [
  {
    id: "c-1",
    slug: "beadcraft-mia",
    name: "Mia BeadCraft",
    bio: "TikTok creator focused on cute character builds and beginner tutorials.",
    platform: "TikTok",
    is_featured: true,
    avatar_url:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    featured_works: [
      "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=400&q=80",
    ],
  },
  {
    id: "c-2",
    slug: "pixel-north",
    name: "Pixel North",
    bio: "YouTube long-form tutorials on large sprites, color theory, and ironing finishes.",
    platform: "YouTube",
    is_featured: true,
    avatar_url:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    featured_works: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
    ],
  },
  {
    id: "c-3",
    slug: "studio-lin",
    name: "Studio Lin",
    bio: "Instagram reels on packaging, gift sets, and seasonal drops for small shops.",
    platform: "Instagram",
    is_featured: true,
    avatar_url:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    featured_works: [
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=400&q=80",
    ],
  },
];

function requireSupabase() {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in the environment.",
    );
  }
  return supabase;
}

function normalizeDifficulty(value: unknown): Difficulty {
  const s = String(value ?? "").trim();
  if (s === "Beginner" || s === "Intermediate" || s === "Advanced") return s;
  const lower = s.toLowerCase();
  if (lower === "beginner") return "Beginner";
  if (lower === "intermediate") return "Intermediate";
  if (lower === "advanced") return "Advanced";
  return "Beginner";
}

function normalizeColorRequirements(raw: unknown): ColorRequirement[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    if (item && typeof item === "object") {
      const o = item as Record<string, unknown>;
      return {
        color_name: String(o.color_name ?? o.name ?? ""),
        hex: String(o.hex ?? "#CCCCCC"),
        count: Number(o.count ?? 0),
      };
    }
    return { color_name: "", hex: "#CCCCCC", count: 0 };
  });
}

export function normalizePatternRow(raw: Record<string, unknown>): Pattern {
  const colorsSource = raw.colors_required ?? raw.color_palette;
  const colors_required = normalizeColorRequirements(colorsSource);
  const tags = Array.isArray(raw.tags) ? (raw.tags as string[]) : [];
  return {
    id: String(raw.id ?? ""),
    slug: String(raw.slug ?? ""),
    title: String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    image_url: String(raw.image_url ?? ""),
    difficulty: normalizeDifficulty(raw.difficulty),
    peg_width: Number(raw.peg_width ?? 29),
    peg_height: Number(raw.peg_height ?? 29),
    bead_count: Number(raw.bead_count ?? 0),
    colors_required,
    tags,
    seo_title: raw.seo_title != null ? String(raw.seo_title) : null,
    seo_description: raw.seo_description != null ? String(raw.seo_description) : null,
    created_at: raw.created_at != null ? String(raw.created_at) : undefined,
    author_name: raw.author_name != null ? String(raw.author_name) : null,
    like_count: raw.like_count != null ? Number(raw.like_count) : null,
  };
}

export function normalizeSupplierRow(raw: Record<string, unknown>): Supplier {
  const verified =
    typeof raw.is_verified === "boolean"
      ? raw.is_verified
      : typeof raw.verified === "boolean"
        ? raw.verified
        : Boolean(raw.verified ?? raw.is_verified);
  const moqRaw = raw.moq;
  const moq = typeof moqRaw === "number" ? String(moqRaw) : String(moqRaw ?? "");
  const main_products = Array.isArray(raw.main_products) ? (raw.main_products as string[]) : [];
  const certification_badges = Array.isArray(raw.certification_badges)
    ? (raw.certification_badges as string[])
    : [];
  const accepted_payment = Array.isArray(raw.accepted_payment)
    ? (raw.accepted_payment as string[])
    : [];
  const gallery_urls = Array.isArray(raw.gallery_urls) ? (raw.gallery_urls as string[]) : [];

  return {
    id: String(raw.id ?? ""),
    slug: String(raw.slug ?? ""),
    company_name: String(raw.company_name ?? raw.name ?? "Supplier"),
    description: String(raw.description ?? ""),
    location: String(raw.location ?? ""),
    factory_type: String(raw.factory_type ?? ""),
    moq,
    lead_time: String(raw.lead_time ?? ""),
    accepted_payment,
    is_verified: verified,
    contact_email: raw.contact_email != null ? String(raw.contact_email) : null,
    website: raw.website != null ? String(raw.website) : null,
    main_products,
    certification_badges,
    gallery_urls,
    established_year: raw.established_year != null ? String(raw.established_year) : null,
    factory_area: raw.factory_area != null ? String(raw.factory_area) : null,
    employee_count: raw.employee_count != null ? String(raw.employee_count) : null,
  };
}

export async function getPatterns(): Promise<Pattern[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("patterns")
    .select("*")
    .order("created_at", { ascending: false, nullsFirst: false })
    .limit(500);
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizePatternRow(row as Record<string, unknown>));
}

export const getPatternBySlug = cache(async (slug: string): Promise<Pattern | null> => {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from("patterns").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return normalizePatternRow(data as Record<string, unknown>);
});

export async function getRelatedPatterns(currentSlug: string, limit = 4): Promise<Pattern[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("patterns")
    .select("*")
    .neq("slug", currentSlug)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => normalizePatternRow(row as Record<string, unknown>));
}

export async function getSuppliers(): Promise<Supplier[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("created_at", { ascending: false, nullsFirst: false })
    .limit(200);
  if (error) throw new Error(error.message);
  const raw = (data ?? []) as Record<string, unknown>[];
  raw.sort((a, b) => {
    const va = Boolean(a.is_verified ?? a.verified);
    const vb = Boolean(b.is_verified ?? b.verified);
    if (va !== vb) return va ? -1 : 1;
    return String(b.created_at ?? "").localeCompare(String(a.created_at ?? ""));
  });
  return raw.map((row) => normalizeSupplierRow(row));
}

export const getSupplierBySlug = cache(async (slug: string): Promise<Supplier | null> => {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from("suppliers").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return normalizeSupplierRow(data as Record<string, unknown>);
});

export async function getFeaturedCreators() {
  const supabase = createSupabaseServerClient();
  if (!supabase) return fallbackCreators;
  const { data, error } = await supabase.from("creators").select("*").eq("is_featured", true).limit(8);
  if (error || !data?.length) return fallbackCreators;
  return data as Creator[];
}

/** Homepage: first N patterns for trending strip */
export async function getTrendingPatterns(limit = 6) {
  const patterns = await getPatterns();
  return patterns.slice(0, limit);
}

/** Homepage: top verified suppliers first, up to `limit` */
export async function getTopSuppliersForHome(limit = 4) {
  const all = await getSuppliers();
  const verified = all.filter((s) => s.is_verified);
  const rest = all.filter((s) => !s.is_verified);
  return [...verified, ...rest].slice(0, limit);
}

/** Homepage: up to 3 featured creators */
export async function getHomeCreators(limit = 3) {
  const creators = await getFeaturedCreators();
  return creators.slice(0, limit);
}
