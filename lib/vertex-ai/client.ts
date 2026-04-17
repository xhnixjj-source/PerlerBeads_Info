import { VertexAI } from "@google-cloud/vertexai";

let vertexInstance: VertexAI | null | undefined;

/**
 * Vertex AI client (singleton).
 * Auth: set `GOOGLE_APPLICATION_CREDENTIALS` to a service account JSON path,
 * or run on GCP with attached service account.
 */
export function getVertexAI(): VertexAI | null {
  if (vertexInstance !== undefined) return vertexInstance;

  const project = process.env.GOOGLE_CLOUD_PROJECT_ID?.trim();
  const location = process.env.GOOGLE_CLOUD_LOCATION?.trim();
  if (!project || !location) {
    vertexInstance = null;
    return null;
  }

  vertexInstance = new VertexAI({ project, location });
  return vertexInstance;
}

/** Default: Gemini on Vertex (text-bison is legacy; override via VERTEX_AI_MODEL). */
export function getVertexModelId(): string {
  return (process.env.VERTEX_AI_MODEL || "gemini-1.5-flash").trim();
}

export function isVertexConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLOUD_PROJECT_ID?.trim() && process.env.GOOGLE_CLOUD_LOCATION?.trim());
}
