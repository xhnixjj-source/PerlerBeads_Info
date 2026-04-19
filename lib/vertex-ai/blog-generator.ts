import type { GenerativeModel } from "@google-cloud/vertexai";
import { getVertexAI, getVertexModelId } from "@/lib/vertex-ai/client";
import type { BlogPost } from "@/lib/vertex-ai/types";

function getBlogModel(): GenerativeModel | null {
  const vertex = getVertexAI();
  if (!vertex) return null;
  return vertex.getGenerativeModel({
    model: getVertexModelId(),
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    },
  });
}

const BLOG_PROMPT_TEMPLATE = `You are an SEO-focused content writer for "PerlerHub", a Perler / 拼豆 (fuse bead) craft site.

Write ONE blog post draft optimized for search and readability.

## Inputs
- Topic: {{TOPIC}}
- Target keywords (use naturally, do not keyword-stuff): {{KEYWORDS}}
- Target audience: {{AUDIENCE}}

## Output rules
- Return **only** valid JSON (no markdown fences, no commentary).
- JSON shape:
{
  "title": string (<= 70 chars),
  "slug": string (kebab-case, lowercase, alphanumeric and hyphens only, <= 80 chars),
  "excerpt": string (<= 320 chars, plain text),
  "content": object — a TipTap/ProseMirror-style document: { "type": "doc", "content": [ ... block nodes ... ] } with at least one paragraph and one bulletList or orderedList where appropriate,
  "seo_title": string (<= 60 chars),
  "seo_description": string (<= 160 chars),
  "seo_keywords": string (comma-separated, max 10 terms)
}
- Language: match the topic (English or Chinese) consistently.
- Tone: helpful, friendly, craft-focused; avoid medical/financial claims.
`;

function fillTemplate(topic: string, keywords: string[], audience: string): string {
  return BLOG_PROMPT_TEMPLATE.replace("{{TOPIC}}", topic.trim())
    .replace("{{KEYWORDS}}", keywords.map((k) => k.trim()).filter(Boolean).join(", ") || "(none)")
    .replace("{{AUDIENCE}}", audience.trim() || "hobby crafters");
}

function parseBlogPostJson(text: string): BlogPost {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Vertex AI did not return valid JSON.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid blog JSON shape.");
  }

  const o = parsed as Record<string, unknown>;
  const content = o.content;
  if (!content || typeof content !== "object") {
    throw new Error("Missing content document.");
  }

  const doc = content as Record<string, unknown>;
  if (doc.type !== "doc" || !Array.isArray(doc.content)) {
    throw new Error('content must be a TipTap doc: { type: "doc", content: [...] }');
  }

  return {
    title: String(o.title ?? "").slice(0, 500),
    slug: String(o.slug ?? "").slice(0, 300),
    excerpt: String(o.excerpt ?? "").slice(0, 2000),
    content: content as Record<string, unknown>,
    seo_title: String(o.seo_title ?? o.title ?? "").slice(0, 200),
    seo_description: String(o.seo_description ?? "").slice(0, 500),
    seo_keywords: String(o.seo_keywords ?? "").slice(0, 500),
  };
}

const SOURCES_TEMPLATE = `You are an SEO-focused content writer for "PerlerHub", a Perler / 拼豆 (fuse bead) craft site.

Write ONE blog post draft based primarily on the source material below (scraped pages and optional video transcript). Synthesize into a coherent article; do not copy verbatim long spans.

## Source material (markdown)
{{SOURCES}}

{{TRANSCRIPT_BLOCK}}

## Target keywords (use naturally, do not keyword-stuff)
{{KEYWORDS}}

## Target audience
{{AUDIENCE}}

## Output rules
- Return **only** valid JSON (no markdown fences, no commentary).
- JSON shape:
{
  "title": string (<= 70 chars),
  "slug": string (kebab-case, lowercase, alphanumeric and hyphens only, <= 80 chars),
  "excerpt": string (<= 320 chars, plain text),
  "content": object — a TipTap/ProseMirror-style document: { "type": "doc", "content": [ ... block nodes ... ] } with at least one paragraph and one bulletList or orderedList where appropriate,
  "seo_title": string (<= 60 chars),
  "seo_description": string (<= 160 chars),
  "seo_keywords": string (comma-separated, max 10 terms)
}
- Language: match the dominant language of the sources.
- Tone: helpful, friendly, craft-focused; avoid medical/financial claims.
`;

const MAX_SOURCES_CHARS = 120_000;

export async function generateBlogPost(
  topic: string,
  keywords: string[],
  audience: string,
): Promise<BlogPost> {
  const model = getBlogModel();
  if (!model) {
    throw new Error("Vertex AI is not configured (GOOGLE_CLOUD_PROJECT_ID / GOOGLE_CLOUD_LOCATION).");
  }

  const prompt = fillTemplate(topic, keywords, audience);
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text || typeof text !== "string") {
    throw new Error("Vertex AI returned an empty response.");
  }

  return parseBlogPostJson(text);
}

export async function generateBlogPostFromSources(
  sourcesMarkdown: string,
  keywords: string[],
  audience: string,
  videoTranscript?: string,
): Promise<BlogPost> {
  const model = getBlogModel();
  if (!model) {
    throw new Error("Vertex AI is not configured (GOOGLE_CLOUD_PROJECT_ID / GOOGLE_CLOUD_LOCATION).");
  }

  let src = sourcesMarkdown.trim();
  if (src.length > MAX_SOURCES_CHARS) {
    src = `${src.slice(0, MAX_SOURCES_CHARS)}\n\n[truncated]`;
  }

  const transcriptBlock =
    videoTranscript && videoTranscript.trim().length > 0
      ? `## Optional video / audio transcript (plain text)\n${videoTranscript.trim().slice(0, 32_000)}`
      : "";

  const prompt = SOURCES_TEMPLATE.replace("{{SOURCES}}", src || "(empty)")
    .replace("{{TRANSCRIPT_BLOCK}}", transcriptBlock ? `\n${transcriptBlock}\n` : "\n")
    .replace("{{KEYWORDS}}", keywords.map((k) => k.trim()).filter(Boolean).join(", ") || "(none)")
    .replace("{{AUDIENCE}}", audience.trim() || "hobby crafters");

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text || typeof text !== "string") {
    throw new Error("Vertex AI returned an empty response.");
  }

  return parseBlogPostJson(text);
}
