import { AdminDetailShell } from "@/components/admin/AdminDetailShell";
import { AdminFormPlaceholder } from "@/components/admin/AdminFormPlaceholder";

export default function NewBlogPostPage() {
  return (
    <AdminDetailShell title="New post" subtitle="Rich text and SEO metadata." backHref="/admin/blog">
      <AdminFormPlaceholder entity="blog post" />
    </AdminDetailShell>
  );
}
