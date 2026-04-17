/**
 * Demo catalog used previously as hardcoded fallbacks in `lib/catalog.ts` (before Supabase-only reads).
 * Kept here as the canonical source for `scripts/seed_database.ts`.
 *
 * Shapes match `public.patterns` / `public.suppliers` in `supabase/schema.sql`.
 */

export type PatternSeedInsert = {
  slug: string;
  title: string;
  description: string;
  image_url: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  peg_width: number;
  peg_height: number;
  bead_count: number;
  colors_required: { color_name: string; hex: string; count: number }[];
  tags: string[];
  seo_title?: string | null;
  seo_description?: string | null;
  created_at?: string;
};

export type SupplierSeedInsert = {
  slug: string;
  company_name: string;
  description: string;
  location: string;
  factory_type: string;
  moq: string;
  lead_time: string;
  accepted_payment: string[];
  is_verified: boolean;
  contact_email: string | null;
  website: string | null;
  main_products: string[];
  certification_badges: string[];
  gallery_urls: string[];
};

/** 6 patterns — same content as the old `fallbackPatterns` in `lib/catalog.ts`. */
export const SEED_PATTERNS: PatternSeedInsert[] = [
  {
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
    created_at: "2025-11-01T12:00:00.000Z",
  },
  {
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
    created_at: "2025-10-15T09:30:00.000Z",
  },
  {
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
    created_at: "2025-09-20T16:45:00.000Z",
  },
  {
    slug: "space-invader-mini",
    title: "Space Invader Mini Sprite",
    description:
      "Tiny arcade alien perfect for keychains and magnets. Uses a tight 16x16 grid with four classic colors.",
    image_url:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    difficulty: "Beginner",
    peg_width: 16,
    peg_height: 16,
    bead_count: 210,
    colors_required: [
      { color_name: "Green", hex: "#3CB878", count: 90 },
      { color_name: "Black", hex: "#111111", count: 80 },
      { color_name: "White", hex: "#EEEEEE", count: 40 },
    ],
    tags: ["games", "retro", "mini"],
    created_at: "2025-08-01T11:00:00.000Z",
  },
  {
    slug: "holiday-snowflake-ornament",
    title: "Holiday Snowflake Ornament",
    description:
      "Symmetrical snowflake layout for winter decor. Intermediate symmetry practice with cool blue and silver tones.",
    image_url:
      "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=1200&q=80",
    difficulty: "Intermediate",
    peg_width: 29,
    peg_height: 29,
    bead_count: 780,
    colors_required: [
      { color_name: "Light Blue", hex: "#A8D8EA", count: 260 },
      { color_name: "White", hex: "#FFFFFF", count: 300 },
      { color_name: "Silver", hex: "#C0C0C0", count: 220 },
    ],
    tags: ["holidays", "winter", "symmetry"],
    created_at: "2025-07-12T08:00:00.000Z",
  },
  {
    slug: "3d-cube-illusion",
    title: "3D Cube Illusion",
    description:
      "Advanced shading illusion using isometric-style color blocks. Best for experienced builders teaching depth on flat boards.",
    image_url:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    difficulty: "Advanced",
    peg_width: 32,
    peg_height: 32,
    bead_count: 1024,
    colors_required: [
      { color_name: "Navy", hex: "#1E3A5F", count: 340 },
      { color_name: "Sky", hex: "#87CEEB", count: 280 },
      { color_name: "White", hex: "#F5F5F5", count: 404 },
    ],
    tags: ["3d", "illusion", "advanced"],
    created_at: "2025-06-01T14:20:00.000Z",
  },
];

/** 4 suppliers — same content as the old `fallbackSuppliers` in `lib/catalog.ts`. */
export const SEED_SUPPLIERS: SupplierSeedInsert[] = [
  {
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
    contact_email: "sales@colorbead.example.com",
    website: null,
    gallery_urls: [
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
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
    contact_email: "export@pegboard-tools.example.com",
    website: null,
    gallery_urls: [
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    slug: "dongguan-packaging-house",
    company_name: "Dongguan Bead Packaging House",
    description:
      "Retail-ready blister packs, hang tags, and multilingual inserts for Amazon and DTC brands.",
    location: "Dongguan, Guangdong, China",
    factory_type: "Packaging",
    moq: "5,000 units",
    lead_time: "12-18 days",
    accepted_payment: ["T/T", "PayPal"],
    is_verified: true,
    main_products: ["blister packs", "color charts", "gift boxes"],
    certification_badges: ["RoHS"],
    contact_email: "hello@packaging-house.example.com",
    website: null,
    gallery_urls: [
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    slug: "ningbo-iron-press-oem",
    company_name: "Ningbo Iron Press OEM",
    description: "Mini irons, silicone mats, and ironing paper rolls with EU/US plug options.",
    location: "Ningbo, Zhejiang, China",
    factory_type: "Irons",
    moq: "500 pcs",
    lead_time: "10-14 days",
    accepted_payment: ["T/T", "L/C"],
    is_verified: true,
    main_products: ["mini irons", "ironing paper", "silicone mats"],
    certification_badges: ["CE", "GS"],
    contact_email: "oem@iron-press.example.com",
    website: null,
    gallery_urls: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80",
    ],
  },
];
