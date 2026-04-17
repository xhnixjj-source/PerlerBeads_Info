import type { GenerativeModel } from "@google-cloud/vertexai";
import { getVertexAI, getVertexModelId } from "@/lib/vertex-ai/client";
import type { PatternMetadata } from "@/lib/vertex-ai/types";

function getVisionModel(): GenerativeModel | null {
  const vertex = getVertexAI();
  if (!vertex) return null;
  return vertex.getGenerativeModel({
    model: getVertexModelId(),
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
    },
  });
}

const VISION_PROMPT = `You analyze fuse-bead / Perler bead pattern images (pixel art).

Return **only** valid JSON with this exact shape:
{
  "title": string (short, descriptive, <= 80 chars),
  "description": string (1-2 sentences, <= 240 chars),
  "difficulty": "beginner" | "intermediate" | "advanced",
  "tags": string[] (3-8 tags, lowercase kebab or short words),
  "colors_required": [ { "color_name": string, "hex": "#RRGGBB", "count": number } ],
  "estimated_bead_count": number (integer, sum of counts or total bead estimate),
  "seo_title": string (<= 60 chars),
  "seo_description": string (<= 160 chars),
  "seo_keywords": string (comma-separated, max 10)
}

Rules:
- Infer plausible Perler-like colors from the image; if uncertain, use generic names (e.g. "Red", "Black") and reasonable hex values.
- "count" is approximate beads for that color in the pattern.
- difficulty: beginner = simple few colors; advanced = many colors or fine detail.
`;

function guessMimeFromUrl(url: string): string {
  const lower = url.split("?")[0]?.toLowerCase() ?? "";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  return "image/jpeg";
}

async function fetchImageAsBase64(imageUrl: string): Promise<{ mimeType: string; data: string }> {
  const res = await fetch(imageUrl, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch image: ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const mimeType = res.headers.get("content-type")?.split(";")[0]?.trim() || guessMimeFromUrl(imageUrl);
  return { mimeType, data: buf.toString("base64") };
}

function parseMetadataJson(text: string): PatternMetadata {
  const parsed = JSON.parse(text) as Record<string, unknown>;
  const difficultyRaw = String(parsed.difficulty ?? "beginner").toLowerCase();
  const difficulty =
    difficultyRaw === "intermediate" || difficultyRaw === "advanced" || difficultyRaw === "beginner"
      ? difficultyRaw
      : "beginner";

  const colorsRaw = parsed.colors_required;
  const colors_required = Array.isArray(colorsRaw)
    ? colorsRaw.map((c) => {
        const row = c as Record<string, unknown>;
        return {
          color_name: String(row.color_name ?? ""),
          hex: String(row.hex ?? "#CCCCCC"),
          count: Math.max(0, Math.floor(Number(row.count ?? 0))),
        };
      })
    : [];

  const tags = Array.isArray(parsed.tags) ? (parsed.tags as unknown[]).map((t) => String(t)) : [];

  return {
    title: String(parsed.title ?? "Pattern").slice(0, 200),
    description: String(parsed.description ?? "").slice(0, 500),
    difficulty,
    tags,
    colors_required,
    estimated_bead_count: Math.max(0, Math.floor(Number(parsed.estimated_bead_count ?? 0))),
    seo_title: String(parsed.seo_title ?? parsed.title ?? "").slice(0, 200),
    seo_description: String(parsed.seo_description ?? "").slice(0, 500),
    seo_keywords: String(parsed.seo_keywords ?? "").slice(0, 500),
  };
}

/** Analyze a pattern image from a public URL using Vertex Gemini (multimodal). */
export async function analyzePatternImage(imageUrl: string): Promise<PatternMetadata> {
  const model = getVisionModel();
  if (!model) {
    throw new Error("Vertex AI is not configured (GOOGLE_CLOUD_PROJECT_ID / GOOGLE_CLOUD_LOCATION).");
  }

  const { mimeType, data } = await fetchImageAsBase64(imageUrl);

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: VISION_PROMPT }, { inlineData: { mimeType, data } }],
      },
    ],
  });

  const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text || typeof text !== "string") {
    throw new Error("Vertex AI returned an empty response.");
  }

  return parseMetadataJson(text);
}

/** Analyze raw image bytes (e.g. user upload). */
export async function analyzePatternImageBuffer(buffer: Buffer, mimeType: string): Promise<PatternMetadata> {
  const model = getVisionModel();
  if (!model) {
    throw new Error("Vertex AI is not configured (GOOGLE_CLOUD_PROJECT_ID / GOOGLE_CLOUD_LOCATION).");
  }

  const data = buffer.toString("base64");
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: VISION_PROMPT }, { inlineData: { mimeType: mimeType || "image/png", data } }],
      },
    ],
  });

  const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text || typeof text !== "string") {
    throw new Error("Vertex AI returned an empty response.");
  }

  return parseMetadataJson(text);
}
