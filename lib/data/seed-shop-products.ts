/**
 * Demo storefront products for local / staging tests.
 * Requires `public.categories` rows with slugs from ecommerce migration
 * (perler-beads, wooden-toys, 3d-printing).
 */

export type SeedShopProductDef = {
  categorySlug: string;
  slug: string;
  name: string;
  description: string;
  priceUsd: number;
  stock: number;
  sku: string;
  moq: number;
  images: string[];
  featured: boolean;
  listStatus: "draft" | "published";
  tags: string[];
  specifications: Record<string, string>;
};

/** Unsplash URLs — allowed in next.config `images.remotePatterns` for this project. */
const IMG = {
  beads: "https://images.unsplash.com/photo-1596464716127-f2a82984de38?w=800&q=80",
  board: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
  wood: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
  toy: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&q=80",
  print: "https://images.unsplash.com/photo-1631541907875-9a1aabb32e52?w=800&q=80",
  desk: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
};

export const SEED_SHOP_PRODUCTS: SeedShopProductDef[] = [
  {
    categorySlug: "perler-beads",
    slug: "demo-shop-fuse-bead-mix-5mm",
    name: "Demo 5mm fuse bead color mix (600 pcs)",
    description:
      "Simulated listing for testing the store grid and checkout. Includes six starter colors in a reusable tray.",
    priceUsd: 12.99,
    stock: 120,
    sku: "DEMO-PER-001",
    moq: 1,
    images: [IMG.beads],
    featured: true,
    listStatus: "published",
    tags: ["demo", "perler", "starter"],
    specifications: { size: "5mm", weight_g: "approx 180" },
  },
  {
    categorySlug: "perler-beads",
    slug: "demo-shop-pegboard-small",
    name: "Demo small interlocking pegboards (2-pack)",
    description: "Mock B2C SKU — square pegboards suitable for small motifs.",
    priceUsd: 8.5,
    stock: 45,
    sku: "DEMO-PER-002",
    moq: 1,
    images: [IMG.board],
    featured: false,
    listStatus: "published",
    tags: ["demo", "pegboard"],
    specifications: { pack: "2", size_cm: "14 x 14" },
  },
  {
    categorySlug: "perler-beads",
    slug: "demo-shop-ironing-paper-roll",
    name: "Demo ironing paper roll (3 m)",
    description: "Non-stick paper for fusing demos — test cart quantity limits.",
    priceUsd: 4.25,
    stock: 200,
    sku: "DEMO-PER-003",
    moq: 1,
    images: [IMG.desk],
    featured: false,
    listStatus: "published",
    tags: ["demo", "accessory"],
    specifications: { length_m: "3" },
  },
  {
    categorySlug: "wooden-toys",
    slug: "demo-shop-wooden-puzzle-animals",
    name: "Demo wooden animal puzzle set",
    description: "Simulated wooden craft toy with laser-cut pieces for storefront QA.",
    priceUsd: 22.0,
    stock: 30,
    sku: "DEMO-WOOD-001",
    moq: 1,
    images: [IMG.wood],
    featured: true,
    listStatus: "published",
    tags: ["demo", "wood", "puzzle"],
    specifications: { pieces: "24", age: "3+" },
  },
  {
    categorySlug: "wooden-toys",
    slug: "demo-shop-stacking-rainbow",
    name: "Demo stacking rainbow arches",
    description: "Painted birch arches — use to test category filter on /products.",
    priceUsd: 34.99,
    stock: 18,
    sku: "DEMO-WOOD-002",
    moq: 1,
    images: [IMG.toy],
    featured: false,
    listStatus: "published",
    tags: ["demo", "montessori-style"],
    specifications: { arches: "7", material: "birch plywood" },
  },
  {
    categorySlug: "wooden-toys",
    slug: "demo-shop-mini-vehicle-set",
    name: "Demo mini wooden vehicles (set of 6)",
    description: "Simple push-along cars for cart multi-line tests.",
    priceUsd: 16.5,
    stock: 60,
    sku: "DEMO-WOOD-003",
    moq: 1,
    images: [IMG.toy],
    featured: false,
    listStatus: "published",
    tags: ["demo", "vehicles"],
    specifications: { count: "6", scale: "1:64 style" },
  },
  {
    categorySlug: "3d-printing",
    slug: "demo-shop-pla-silk-sample",
    name: "Demo PLA silk filament sample (250 g)",
    description: "Mock 3D printing consumable — published for listing tests.",
    priceUsd: 14.0,
    stock: 80,
    sku: "DEMO-3DP-001",
    moq: 1,
    images: [IMG.print],
    featured: true,
    listStatus: "published",
    tags: ["demo", "filament", "PLA"],
    specifications: { diameter_mm: "1.75", color: "Silk gold" },
  },
  {
    categorySlug: "3d-printing",
    slug: "demo-shop-printed-organizer",
    name: "Demo printed desk organizer (single piece)",
    description: "Simulated finished print — good for detail page and stock checks.",
    priceUsd: 19.99,
    stock: 12,
    sku: "DEMO-3DP-002",
    moq: 1,
    images: [IMG.print, IMG.desk],
    featured: false,
    listStatus: "published",
    tags: ["demo", "organizer"],
    specifications: { material: "PLA", layers_visible: "yes" },
  },
  {
    categorySlug: "3d-printing",
    slug: "demo-shop-nozzle-brass-04",
    name: "Demo brass nozzle 0.4 mm (2-pack)",
    description: "Small parts line — use to verify checkout line-item pricing.",
    priceUsd: 9.49,
    stock: 150,
    sku: "DEMO-3DP-003",
    moq: 1,
    images: [IMG.print],
    featured: false,
    listStatus: "published",
    tags: ["demo", "nozzle"],
    specifications: { diameter_mm: "0.4", thread: "M6" },
  },
];
