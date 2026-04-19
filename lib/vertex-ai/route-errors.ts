/**
 * Maps known Vertex / GCP errors to stable HTTP API responses.
 * Avoid returning multi-line Google JSON bodies to clients.
 */
export function mapVertexClientError(err: unknown): { status: number; message: string; code: string } | null {
  const e = err instanceof Error ? err : new Error(String(err));
  const parts = [e.message, e.cause instanceof Error ? e.cause.message : e.cause != null ? String(e.cause) : ""].join(
    " ",
  );

  if (
    /GoogleAuthError|Unable to authenticate/i.test(parts) &&
    (/ENOENT|does not exist|not a file|EISDIR/i.test(parts) || /\.json/i.test(parts))
  ) {
    return {
      status: 503,
      code: "vertex_auth",
      message:
        "Vertex authentication failed: GOOGLE_APPLICATION_CREDENTIALS points to a missing or unreadable service account JSON file. Fix the path or place the key file.",
    };
  }

  if (
    /CONSUMER_INVALID/i.test(parts) ||
    (/VertexAI\.ClientError/i.test(parts) && /403|Forbidden|PERMISSION_DENIED/i.test(parts))
  ) {
    return {
      status: 503,
      code: "vertex_project",
      message:
        "Vertex API returned 403 for this GCP project (CONSUMER_INVALID / permission denied). In Google Cloud Console: set GOOGLE_CLOUD_PROJECT_ID to your real project id (not a display name); enable billing on that project; enable the 'Vertex AI API'; use a service account key created in that same project with a role such as Vertex AI User.",
    };
  }

  return null;
}
