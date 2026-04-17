import { AdminDetailShell } from "@/components/admin/AdminDetailShell";
import { AdminFormPlaceholder } from "@/components/admin/AdminFormPlaceholder";

export default function NewPatternPage() {
  return (
    <AdminDetailShell title="New pattern" subtitle="Upload artwork and palette metadata." backHref="/admin/patterns">
      <AdminFormPlaceholder entity="pattern" />
    </AdminDetailShell>
  );
}
