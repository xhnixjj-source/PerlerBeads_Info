/**
 * Synthetic rows for bulk demo seeding (`scripts/seed_demo_bulk.ts`).
 * Slugs use `bulk-pattern-*` / `bulk-supplier-*` so they do not collide with hand-seeded catalog slugs.
 */

import type { PatternSeedInsert, SupplierSeedInsert } from "./seed-catalog";

/** Only URLs already used in `seed-catalog.ts` (avoids Unsplash 404s / ID churn). */
const PATTERN_IMAGES = [
  "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
];

const ADJECTIVES = [
  "Neon",
  "Retro",
  "Mini",
  "Kawaii",
  "Pastel",
  "8-bit",
  "Holiday",
  "Garden",
  "Space",
  "Ocean",
  "Sunset",
  "Crystal",
  "Forest",
  "City",
  "Desert",
  "Winter",
  "Spring",
  "Comic",
  "Pixel",
  "Soft",
];

const SUBJECTS = [
  "sprite",
  "avatar",
  "badge",
  "icon",
  "tile",
  "panel",
  "keychain",
  "magnet",
  "coaster",
  "ornament",
  "portrait",
  "landscape",
  "mascot",
  "logo",
  "frame",
  "border",
  "starfield",
  "floral",
  "geometric",
  "symmetry",
];

const TAG_POOL = [
  "starter",
  "gift",
  "kids",
  "decor",
  "anime",
  "games",
  "nature",
  "abstract",
  "symmetry",
  "palette",
  "keychain",
  "seasonal",
  "cute",
  "retro",
  "minimal",
];

const COLOR_POOL = [
  { color_name: "Yellow", hex: "#FFDD4A" },
  { color_name: "Black", hex: "#222222" },
  { color_name: "Red", hex: "#E53935" },
  { color_name: "White", hex: "#F5F5F5" },
  { color_name: "Blue", hex: "#1E88E5" },
  { color_name: "Green", hex: "#43A047" },
  { color_name: "Pink", hex: "#F48FB1" },
  { color_name: "Orange", hex: "#FB8C00" },
  { color_name: "Purple", hex: "#8E24AA" },
  { color_name: "Teal", hex: "#00897B" },
];

const DIFFICULTIES: Array<"Beginner" | "Intermediate" | "Advanced"> = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

const BOARD_SIZES = [
  [16, 16],
  [22, 22],
  [29, 29],
  [32, 32],
  [40, 40],
  [45, 45],
  [29, 45],
  [58, 29],
];

const CITIES = [
  "Yiwu, Zhejiang, China",
  "Shantou, Guangdong, China",
  "Dongguan, Guangdong, China",
  "Ningbo, Zhejiang, China",
  "Shenzhen, Guangdong, China",
  "Guangzhou, Guangdong, China",
  "Foshan, Guangdong, China",
  "Hangzhou, Zhejiang, China",
  "Suzhou, Jiangsu, China",
  "Qingdao, Shandong, China",
];

const FACTORY_LABELS = [
  "Raw Material",
  "Tools & pegboards",
  "Packaging",
  "Mini irons",
  "OEM kits",
  "Color sorting",
  "Storage & trays",
  "Retail displays",
];

const MOQ_SAMPLES = [
  "50 sets",
  "100 bags / color",
  "500 pcs",
  "1,000 units",
  "2 MOQ colors",
  "20 cartons",
  "300 MOQ",
  "Flexible for trial",
];

const PAYMENT_OPTIONS = [
  ["T/T", "PayPal"],
  ["T/T", "L/C"],
  ["PayPal", "Western Union"],
  ["T/T"],
];

const PRODUCT_CHIPS = [
  ["5mm beads", "starter kits"],
  ["pegboards", "tweezers"],
  ["blister packs", "hang tags"],
  ["mini irons", "silicone mats"],
  ["sorting trays", "labels"],
  ["gift boxes", "color charts"],
  ["bulk beads", "OEM bags"],
  ["ironing paper", "tape rolls"],
];

const BADGES_POOL = [["RoHS"], ["CE"], ["EN71", "RoHS"], ["CE", "GS"], ["REACH"], []];

const SUPPLIER_GALLERY = [
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80",
];

function patternColorsForIndex(i: number) {
  const n = 3 + (i % 3);
  const out: { color_name: string; hex: string; count: number }[] = [];
  for (let k = 0; k < n; k += 1) {
    const c = COLOR_POOL[(i + k) % COLOR_POOL.length];
    out.push({ color_name: c.color_name, hex: c.hex, count: 40 + ((i * 17 + k * 31) % 220) });
  }
  return out;
}

function patternTagsForIndex(i: number): string[] {
  const a = TAG_POOL[i % TAG_POOL.length];
  const b = TAG_POOL[(i + 5) % TAG_POOL.length];
  const c = TAG_POOL[(i + 11) % TAG_POOL.length];
  return Array.from(new Set([a, b, c]));
}

/** Build `count` synthetic patterns (default 20). */
export function buildBulkPatterns(count = 20): PatternSeedInsert[] {
  const rows: PatternSeedInsert[] = [];
  for (let i = 0; i < count; i += 1) {
    const n = i + 1;
    const slug = `bulk-pattern-${String(n).padStart(3, "0")}`;
    const [pw, ph] = BOARD_SIZES[i % BOARD_SIZES.length];
    const difficulty = DIFFICULTIES[i % DIFFICULTIES.length];
    const title = `${ADJECTIVES[i % ADJECTIVES.length]} ${SUBJECTS[(i * 2) % SUBJECTS.length]} #${n}`;
    const description = `Demo pattern ${n} for directory previews — ${difficulty.toLowerCase()} layout on a ${pw}×${ph} peg grid. Replace with your own design copy in production.`;
    const bead_count = Math.min(
      pw * ph,
      Math.round(pw * ph * (0.42 + (i % 7) * 0.06)),
    );
    rows.push({
      slug,
      title,
      description,
      image_url: PATTERN_IMAGES[i % PATTERN_IMAGES.length],
      difficulty,
      peg_width: pw,
      peg_height: ph,
      bead_count,
      colors_required: patternColorsForIndex(i),
      tags: patternTagsForIndex(i),
      seo_title: `${title} | PerlerHub Demo`,
      seo_description: description.slice(0, 140),
    });
  }
  return rows;
}

/** Build `count` synthetic suppliers (default 20). */
export function buildBulkSuppliers(count = 20): SupplierSeedInsert[] {
  const rows: SupplierSeedInsert[] = [];
  for (let i = 0; i < count; i += 1) {
    const n = i + 1;
    const slug = `bulk-supplier-${String(n).padStart(3, "0")}`;
    const city = CITIES[i % CITIES.length];
    const label = FACTORY_LABELS[i % FACTORY_LABELS.length];
    const company_name = `Demo ${label.split(" ")[0]} Partner ${n} Ltd.`;
    const description = `Bulk demo supplier #${n} — ${label.toLowerCase()} for PerlerHub directory previews. Replace with real factory profiles before launch.`;
    const is_verified = i % 3 !== 1;
    const products = PRODUCT_CHIPS[i % PRODUCT_CHIPS.length];
    const badges = BADGES_POOL[i % BADGES_POOL.length];
    const gallery = [SUPPLIER_GALLERY[i % SUPPLIER_GALLERY.length], SUPPLIER_GALLERY[(i + 2) % SUPPLIER_GALLERY.length]];
    rows.push({
      slug,
      company_name,
      description,
      location: city,
      factory_type: label,
      moq: MOQ_SAMPLES[i % MOQ_SAMPLES.length],
      lead_time: `${8 + (i % 10)}–${15 + (i % 8)} days`,
      accepted_payment: PAYMENT_OPTIONS[i % PAYMENT_OPTIONS.length],
      is_verified,
      contact_email: `bulk-demo-${String(n).padStart(3, "0")}@example.local`,
      website: n % 4 === 0 ? `https://demo-supplier-${n}.example.local` : null,
      main_products: [...products, "custom MOQ on request"],
      certification_badges: badges,
      gallery_urls: gallery,
    });
  }
  return rows;
}
