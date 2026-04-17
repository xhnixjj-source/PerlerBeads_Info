import type { SupabaseClient } from "@supabase/supabase-js";

export type LogAction = "create" | "update" | "delete";

export async function logAdminAction(
  supabase: SupabaseClient,
  entry: {
    adminId: string | null;
    action: LogAction;
    tableName: string;
    recordId: string | null;
    changes: Record<string, unknown>;
  },
): Promise<void> {
  try {
    const { error } = await supabase.from("admin_logs").insert({
      admin_id: entry.adminId,
      action: entry.action,
      table_name: entry.tableName,
      record_id: entry.recordId,
      changes: entry.changes,
    });
    if (error) {
      console.error("[admin_logs] insert failed:", error.message, entry.tableName, entry.action);
    }
  } catch (e) {
    console.error("[admin_logs] unexpected:", e);
  }
}
