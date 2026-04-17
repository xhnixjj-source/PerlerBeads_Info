import { AdminDetailShell } from "@/components/admin/AdminDetailShell";
import { AdminFormPlaceholder } from "@/components/admin/AdminFormPlaceholder";

export default function NewSupplierPage() {
  return (
    <AdminDetailShell title="New supplier" subtitle="Create a directory entry." backHref="/admin/suppliers">
      <AdminFormPlaceholder entity="supplier" />
    </AdminDetailShell>
  );
}
