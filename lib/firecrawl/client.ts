import { Agent, fetch as undiciFetch } from "undici";

/** Node default fetch uses ~10s connect timeout; Firecrawl API can be slow from some regions. */
const firecrawlHttpAgent = new Agent({
  connectTimeout: 60_000,
  headersTimeout: 120_000,
  bodyTimeout: 120_000,
});

export type FirecrawlScrapeResult = {
  markdown: string;
  metadata: Record<string, unknown>;
  links?: string[];
};

export function isFirecrawlConfigured(): boolean {
  return Boolean(process.env.FIRECRAWL_API_KEY?.trim());
}

function normalizeBaseUrl(): string {
  const raw = process.env.FIRECRAWL_API_URL?.trim() || "https://api.firecrawl.dev/v1";
  return raw.replace(/\/+$/, "");
}

/**
 * Single-page scrape (Firecrawl v1). API key must stay server-side only.
 */
export async function firecrawlScrape(url: string): Promise<FirecrawlScrapeResult> {
  const key = process.env.FIRECRAWL_API_KEY?.trim();
  if (!key) {
    throw new Error("Firecrawl is not configured (FIRECRAWL_API_KEY).");
  }
  const base = normalizeBaseUrl();
  const scrapeUrl = `${base}/scrape`;

  const res = (await undiciFetch(scrapeUrl, {
    method: "POST",
    dispatcher: firecrawlHttpAgent,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "User-Agent": "PerlerHub/1.0 (server; Firecrawl scrape)",
    },
    body: JSON.stringify({
      url,
      formats: ["markdown", "links"],
    }),
  })) as unknown as Response;

  let json: Record<string, unknown>;
  try {
    json = (await res.json()) as Record<string, unknown>;
  } catch {
    throw new Error("Firecrawl returned invalid JSON.");
  }

  if (!res.ok) {
    const err =
      typeof json.error === "string"
        ? json.error
        : json.message && typeof json.message === "string"
          ? json.message
          : JSON.stringify(json).slice(0, 500);
    throw new Error(`Firecrawl HTTP ${res.status}: ${err}`);
  }

  if (json.success === false) {
    throw new Error("Firecrawl returned success=false.");
  }

  const data = json.data as Record<string, unknown> | undefined;
  if (!data || typeof data !== "object") {
    throw new Error("Firecrawl response missing data.");
  }

  const markdown = typeof data.markdown === "string" ? data.markdown : "";
  const metadata =
    typeof data.metadata === "object" && data.metadata !== null && !Array.isArray(data.metadata)
      ? (data.metadata as Record<string, unknown>)
      : {};
  const links = Array.isArray(data.links)
    ? data.links.filter((x): x is string => typeof x === "string")
    : undefined;

  return { markdown, metadata, links };
}
