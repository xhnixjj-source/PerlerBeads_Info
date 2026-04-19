import type { GenerativeModel } from "@google-cloud/vertexai";
import { getVertexAI, getVertexModelId } from "@/lib/vertex-ai/client";

function getProductModel(): GenerativeModel | null {
  const vertex = getVertexAI();
  if (!vertex) return null;
  return vertex.getGenerativeModel({
    model: getVertexModelId(),
    generationConfig: {
      temperature: 0.25,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    },
  });
}

const MAX_MARKDOWN = 100_000;

const PROMPT = `You are a catalog editor for "PerlerHub", a Perler / fuse bead e-commerce site.

Map the following scraped product page (markdown + optional metadata hints) into a single JSON object for our storefront.

## Scraped content (markdown)
{{MARKDOWN}}

## Source URL
{{SOURCE_URL}}

## Output rules
- Return **only** valid JSON (no markdown fences, no commentary).
- Do NOT include category_id (assigned server-side).
- JSON shape (all strings UTF-8; use null for unknown prices):
{
  "slug": string (kebab-case, lowercase, latin letters digits hyphens only, <= 80 chars),
  "name": string (<= 200 chars, concise product title),
  "description": string (plain text or short HTML allowed, <= 8000 chars),
  "sku": string (<= 120, empty string if unknown),
  "price_usd": number | null,
  "price_cny": number | null,
  "moq": number (integer >= 1, default 1),
  "stock": number (integer >= 0, default 0 if unknown),
  "images": string[] (absolute http(s) image URLs from the page when possible; else []),
  "specifications": object (key-value facts: materials, size, weight, etc.),
  "tags": string[] (max 12 short tags),
  "featured": boolean (default false)
}
- Do not invent prices: use null if not clearly stated.
- Language: match the source page (English or Chinese) for name/description.
`;

export type ProductAiPayload = {
  slug: string;
  name: string;
  description: string;
  sku: string;
  price_usd: number | null;
  price_cny: number | null;
  moq: number;
  stock: number;
  images: unknown[];
  specifications: Record<string, unknown>;
  tags: unknown[];
  featured: boolean;
};

function numOrNull(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v.replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export async function generateProductDraftFromMarkdown(
  markdown: string,
  sourceUrl: string,
): Promise<ProductAiPayload> {
  const model = getProductModel();
  if (!model) {
    throw new Error("Vertex AI is not configured (GOOGLE_CLOUD_PROJECT_ID / GOOGLE_CLOUD_LOCATION).");
  }

  const md = markdown.length > MAX_MARKDOWN ? `${markdown.slice(0, MAX_MARKDOWN)}\n\n[truncated]` : markdown;
  const prompt = PROMPT.replace("{{MARKDOWN}}", md).replace("{{SOURCE_URL}}", sourceUrl.trim());

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text || typeof text !== "string") {
    throw new Error("Vertex AI returned an empty response.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Vertex AI did not return valid JSON.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid product JSON shape.");
  }

  const o = parsed as Record<string, unknown>;

  return {
    slug: String(o.slug ?? "product").slice(0, 300),
    name: String(o.name ?? "Untitled").slice(0, 500),
    description: String(o.description ?? "").slice(0, 20000),
    sku: String(o.sku ?? "").slice(0, 120),
    price_usd: numOrNull(o.price_usd),
    price_cny: numOrNull(o.price_cny),
    moq: typeof o.moq === "number" && Number.isFinite(o.moq) ? Math.max(0, Math.floor(o.moq)) : 1,
    stock: typeof o.stock === "number" && Number.isFinite(o.stock) ? Math.max(0, Math.floor(o.stock)) : 0,
    images: Array.isArray(o.images) ? o.images : [],
    specifications:
      o.specifications && typeof o.specifications === "object" && !Array.isArray(o.specifications)
        ? (o.specifications as Record<string, unknown>)
        : {},
    tags: Array.isArray(o.tags) ? o.tags : [],
    featured: Boolean(o.featured),
  };
}
