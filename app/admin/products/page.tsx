import { ProductsAdminTable } from "@/components/admin/ProductsAdminTable";
import { loadAdminProducts } from "@/lib/admin/list-data";

export const dynamic = "force-dynamic";

export default async function AdminProductsListPage() {
  const products = await loadAdminProducts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-100">Products</h1>
        <p className="mt-1 text-sm text-slate-400">Wholesale SKUs, pricing, and inventory.</p>
      </div>
      <ProductsAdminTable rows={products} />
    </div>
  );
}
