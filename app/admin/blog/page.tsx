import { BlogAdminTable } from "@/components/admin/BlogAdminTable";
import { BlogAiGenerateModal } from "@/components/admin/BlogAiGenerateModal";
import { loadAdminBlogPosts } from "@/lib/admin/list-data";

export const dynamic = "force-dynamic";

export default async function AdminBlogListPage() {
  const rows = await loadAdminBlogPosts();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-100">Blog</h1>
          <p className="mt-1 text-sm text-slate-400">Posts, scheduling, and SEO.</p>
        </div>
        <BlogAiGenerateModal />
      </div>
      <BlogAdminTable rows={rows} />
    </div>
  );
}
