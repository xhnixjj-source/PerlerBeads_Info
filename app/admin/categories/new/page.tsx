import { AdminDetailShell } from "@/components/admin/AdminDetailShell";
import { CategoryForm } from "@/components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <AdminDetailShell title="New category" subtitle="Slug is used in URLs (?category=slug)." backHref="/admin/categories">
      <CategoryForm initial={null} />
    </AdminDetailShell>
  );
}
