import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RequestBody = {
  imageUrl?: string;
};

type AnalyzeResult = {
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  colors_required: { color_name: string; hex: string; count: number }[];
};

function fallbackAnalyze(imageUrl: string): AnalyzeResult {
  const seed = imageUrl.toLowerCase();
  const difficulty: AnalyzeResult["difficulty"] = seed.includes("complex")
    ? "Advanced"
    : seed.includes("mid")
      ? "Intermediate"
      : "Beginner";
  return {
    title: "Generated Perler Pattern",
    description:
      "Auto-generated metadata for a bead pattern image. Review and edit before publishing.",
    difficulty,
    tags: ["auto-generated", "perler", "pixel-art"],
    colors_required: [
      { color_name: "Black", hex: "#1F1F1F", count: 80 },
      { color_name: "White", hex: "#F8F8F8", count: 120 },
      { color_name: "Red", hex: "#D94141", count: 60 },
      { color_name: "Yellow", hex: "#F3C84B", count: 40 },
    ],
  };
}

async function analyzeWithGemini(imageUrl: string): Promise<AnalyzeResult | null> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `
Analyze this pixel/bead pattern image URL and produce strict JSON.
Fields: title, description, difficulty(Beginner|Intermediate|Advanced), tags(string[]), colors_required([{color_name,hex,count}]).
Keep title <= 70 chars and description <= 220 chars.`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }, { text: `Image URL: ${imageUrl}` }],
        },
      ],
      generationConfig: { temperature: 0.2, responseMimeType: "application/json" },
    }),
  });

  if (!response.ok) return null;
  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text || typeof text !== "string") return null;

  try {
    const parsed = JSON.parse(text) as AnalyzeResult;
    if (!parsed.title || !Array.isArray(parsed.tags) || !Array.isArray(parsed.colors_required)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const imageUrl = body.imageUrl?.trim();
  if (!imageUrl) {
    return NextResponse.json({ ok: false, error: "imageUrl is required" }, { status: 400 });
  }

  try {
    const ai = await analyzeWithGemini(imageUrl);
    return NextResponse.json({ ok: true, result: ai || fallbackAnalyze(imageUrl), provider: ai ? "gemini" : "fallback" });
  } catch {
    return NextResponse.json({ ok: true, result: fallbackAnalyze(imageUrl), provider: "fallback" });
  }
}
