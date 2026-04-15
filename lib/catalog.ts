import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Pattern } from "@/lib/types/pattern";
import type { Supplier } from "@/lib/types/supplier";
import type { Creator } from "@/lib/types/creator";

const fallbackPatterns: Pattern[] = [
  {
    id: "p-1",
    slug: "classic-pikachu-8bit",
    title: "Classic Pikachu 8-bit Sprite",
    description:
      "A beginner-friendly square pattern with high contrast yellow/black blocks. Great for 29x29 pegboard practice.",
    image_url:
      "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=1200&q=80",
    difficulty: "Beginner",
    peg_width: 29,
    peg_height: 29,
    bead_count: 592,
    colors_required: [
      { color_name: "Yellow", hex: "#FFDD4A", count: 320 },
      { color_name: "Black", hex: "#222222", count: 96 },
      { color_name: "Red", hex: "#FF4A4A", count: 12 },
      { color_name: "White", hex: "#F8F8F8", count: 164 },
    ],
    tags: ["anime", "pokemon", "starter"],
  },
  {
    id: "p-2",
    slug: "mario-mushroom-retro",
    title: "Mario Mushroom Retro Icon",
    description:
      "Retro game icon optimized for fast bead placement and beginner classes. Minimal palette and clean symmetry.",
    image_url:
      "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=1200&q=80",
    difficulty: "Beginner",
    peg_width: 29,
    peg_height: 29,
    bead_count: 520,
    colors_required: [
      { color_name: "Red", hex: "#D93030", count: 180 },
      { color_name: "White", hex: "#FFFFFF", count: 200 },
      { color_name: "Black", hex: "#1A1A1A", count: 70 },
      { color_name: "Skin", hex: "#F6C5A5", count: 70 },
    ],
    tags: ["games", "mario", "icon"],
  },
  {
    id: "p-3",
    slug: "cherry-blossom-kitty",
    title: "Cherry Blossom Kitty",
    description:
      "Intermediate-level kawaii character with soft pink palette and floral accents. Ideal for gift kits.",
    image_url:
      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1200&q=80",
    difficulty: "Intermediate",
    peg_width: 58,
    peg_height: 58,
    bead_count: 1340,
    colors_required: [
      { color_name: "Pink", hex: "#F59AC1", count: 430 },
      { color_name: "White", hex: "#FCFCFC", count: 420 },
      { color_name: "Brown", hex: "#7A4A2E", count: 180 },
      { color_name: "Green", hex: "#6AA65A", count: 120 },
      { color_name: "Yellow", hex: "#F4CE54", count: 190 },
    ],
    tags: ["cute", "flower", "gift"],
  },
];

const fallbackSuppliers: Supplier[] = [
  {
    id: "s-1",
    slug: "yiwu-colorbead-factory",
    company_name: "Yiwu ColorBead Factory",
    description:
      "Specialized in 5mm fuse beads and beginner kits for EU and US channels.",
    location: "Yiwu, Zhejiang, China",
    factory_type: "Raw Material",
    moq: "100 bags / color",
    lead_time: "7-12 days",
    accepted_payment: ["T/T", "PayPal"],
    is_verified: true,
    main_products: ["5mm fuse beads", "starter kits", "storage boxes"],
    certification_badges: ["EN71", "RoHS"],
  },
  {
    id: "s-2",
    slug: "shantou-pegboard-tools",
    company_name: "Shantou Pegboard Tools Co.",
    description:
      "OEM pegboards and ironing accessories with custom packaging and private label support.",
    location: "Shantou, Guangdong, China",
    factory_type: "Tools",
    moq: "50 sets",
    lead_time: "10-15 days",
    accepted_payment: ["T/T", "L/C"],
    is_verified: false,
    main_products: ["pegboards", "ironing papers", "tweezers"],
    certification_badges: ["CE"],
  },
];

const fallbackCreators: Creator[] = [
  {
    id: "c-1",
    slug: "beadcraft-mia",
    name: "Mia BeadCraft",
    bio: "TikTok creator focused on cute character builds and beginner tutorials.",
    platform: "TikTok",
    is_featured: true,
  },
];

export async function getPatterns() {
  const supabase = createSupabaseServerClient();
  if (!supabase) return fallbackPatterns;
  const { data, error } = await supabase
    .from("patterns")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(60);
  if (error || !data?.length) return fallbackPatterns;
  return data as Pattern[];
}

export async function getPatternBySlug(slug: string) {
  const supabase = createSupabaseServerClient();
  if (!supabase) return fallbackPatterns.find((p) => p.slug === slug) ?? null;
  const { data, error } = await supabase.from("patterns").select("*").eq("slug", slug).single();
  if (error || !data) return fallbackPatterns.find((p) => p.slug === slug) ?? null;
  return data as Pattern;
}

export async function getRelatedPatterns(currentSlug: string, limit = 4) {
  const patterns = await getPatterns();
  return patterns.filter((p) => p.slug !== currentSlug).slice(0, limit);
}

export async function getSuppliers() {
  const supabase = createSupabaseServerClient();
  if (!supabase) return fallbackSuppliers;
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("is_verified", { ascending: false })
    .limit(50);
  if (error || !data?.length) return fallbackSuppliers;
  return data as Supplier[];
}

export async function getSupplierBySlug(slug: string) {
  const supabase = createSupabaseServerClient();
  if (!supabase) return fallbackSuppliers.find((s) => s.slug === slug) ?? null;
  const { data, error } = await supabase.from("suppliers").select("*").eq("slug", slug).single();
  if (error || !data) return fallbackSuppliers.find((s) => s.slug === slug) ?? null;
  return data as Supplier;
}

export async function getFeaturedCreators() {
  const supabase = createSupabaseServerClient();
  if (!supabase) return fallbackCreators;
  const { data, error } = await supabase.from("creators").select("*").eq("is_featured", true).limit(8);
  if (error || !data?.length) return fallbackCreators;
  return data as Creator[];
}
