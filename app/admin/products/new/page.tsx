import { AdminDetailShell } from "@/components/admin/AdminDetailShell";
import { AdminFormPlaceholder } from "@/components/admin/AdminFormPlaceholder";

export default function NewProductPage() {
  return (
    <AdminDetailShell title="New product" subtitle="Add a SKU linked to a supplier." backHref="/admin/products">
      <AdminFormPlaceholder entity="product" />
    </AdminDetailShell>
  );
}
