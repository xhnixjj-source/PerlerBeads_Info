import { z } from "zod";

export const uuidParam = z.string().uuid();

export const supplierCreateSchema = z.object({
  slug: z.string().min(1).max(300),
  name: z.string().min(1).max(500),
  location: z.string().max(500).optional().default(""),
  moq: z.coerce.number().int().min(0).optional().default(1),
  verified: z.boolean().optional().default(false),
  logo_url: z.union([z.string().url(), z.literal("")]).optional().nullable(),
  banner_images: z.array(z.unknown()).optional().default([]),
  certifications: z.array(z.unknown()).optional().default([]),
  products: z.array(z.unknown()).optional().default([]),
  rating: z.coerce.number().min(0).max(5).optional().nullable(),
  review_count: z.coerce.number().int().min(0).optional(),
});

export const supplierUpdateSchema = supplierCreateSchema.partial();

export const productCreateSchema = z.object({
  slug: z.string().min(1).max(300),
  supplier_id: z.string().uuid(),
  name: z.string().min(1).max(500),
  category: z.string().max(200).optional().default(""),
  description: z.string().max(20000).optional().default(""),
  price_usd: z.coerce.number().min(0).optional().nullable(),
  price_cny: z.coerce.number().min(0).optional().nullable(),
  moq: z.coerce.number().int().min(0).optional().default(1),
  stock: z.coerce.number().int().min(0).optional().default(0),
  sku: z.string().max(120).optional().default(""),
  images: z.array(z.unknown()).optional().default([]),
  specifications: z.record(z.string(), z.unknown()).optional().default({}),
  tags: z.array(z.unknown()).optional().default([]),
  featured: z.boolean().optional().default(false),
});

export const productUpdateSchema = productCreateSchema.partial();

const difficultyEnum = z.enum(["beginner", "intermediate", "advanced"]);

export const patternCreateSchema = z.object({
  slug: z.string().min(1).max(300),
  title: z.string().min(1).max(500),
  difficulty: difficultyEnum.default("beginner"),
  color_palette: z.array(z.unknown()).optional().default([]),
  image_url: z.string().min(1).max(2000),
  seo_title: z.string().max(500).optional().nullable(),
  seo_description: z.string().max(5000).optional().nullable(),
  seo_keywords: z.string().max(500).optional().nullable(),
  ai_generated_metadata: z.record(z.string(), z.unknown()).optional().default({}),
  views_count: z.coerce.number().int().min(0).optional(),
  downloads_count: z.coerce.number().int().min(0).optional(),
});

export const patternUpdateSchema = patternCreateSchema.partial();

/** Matches either `supabase_schema.sql` lowercase statuses or migration `20260417000001_*` capitalized ones. */
export const orderUpdateSchema = z.object({
  status: z.string().min(1).max(64).optional(),
  total_price: z.coerce.number().min(0).optional(),
  pattern_id: z.string().uuid().optional(),
  order_number: z.string().max(120).optional(),
});

export const inquiryUpdateSchema = z.object({
  buyer_email: z.string().email().optional(),
  message: z.string().max(20000).optional(),
  supplier_id: z.string().uuid().optional(),
  status: z.enum(["New", "Contacted", "Closed"]).optional(),
  name: z.string().max(200).optional(),
  email: z.string().email().optional(),
  company: z.string().max(200).optional(),
  quantity: z.string().max(120).optional(),
  source: z.string().max(120).optional(),
});

export const blogCreateSchema = z.object({
  slug: z.string().min(1).max(300),
  title: z.string().min(1).max(500),
  content: z.any().optional().default(() => ({ type: "doc", content: [] })),
  excerpt: z.string().max(10000).optional().default(""),
  featured_image_url: z.union([z.string().url(), z.literal("")]).optional().nullable(),
  seo_title: z.string().max(500).optional().nullable(),
  seo_description: z.string().max(5000).optional().nullable(),
  seo_keywords: z.string().max(500).optional().nullable(),
  ai_generated: z.boolean().optional().default(false),
  ai_prompt_used: z.string().max(2000).optional().nullable(),
  status: z.enum(["draft", "published", "scheduled"]).optional().default("draft"),
  published_at: z.union([z.string().max(50), z.literal("")]).optional().nullable(),
  views_count: z.coerce.number().int().min(0).optional(),
});

export const blogUpdateSchema = blogCreateSchema.partial();

export const settingsPutSchema = z.object({
  data: z.record(z.string(), z.unknown()),
});

export const adminUserCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
  role: z.enum(["super_admin", "content_admin", "order_admin", "supplier_admin"]),
});

export const adminUserUpdateSchema = z.object({
  role: z.enum(["super_admin", "content_admin", "order_admin", "supplier_admin"]),
});

export const adminUserResetPasswordSchema = z.object({
  password: z.string().min(8).max(200),
});

export function parseJsonBody<T>(body: unknown, schema: z.ZodType<T>): { ok: true; data: T } | { ok: false; error: string } {
  const r = schema.safeParse(body);
  if (!r.success) {
    const msg = r.error.flatten().fieldErrors
      ? JSON.stringify(r.error.flatten().fieldErrors)
      : r.error.message;
    return { ok: false, error: msg };
  }
  return { ok: true, data: r.data };
}
