import Link from "next/link";
import { loadStoreCategories, loadStoreProducts, firstImageUrl } from "@/lib/shop/catalog";

export const dynamic = "force-dynamic";

type Props = { searchParams?: { category?: string } };

export default async function ProductsPage({ searchParams }: Props) {
  const categorySlug = searchParams?.category?.trim() || undefined;
  const [categories, products] = await Promise.all([
    loadStoreCategories(),
    loadStoreProducts(categorySlug),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-ink-900">Store</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink-600">Browse products by category. Checkout uses a simulated payment for now.</p>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/products"
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            !categorySlug ? "bg-ink-900 text-white" : "border border-ink-200 bg-white text-ink-700 hover:bg-ink-50"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/products?category=${encodeURIComponent(c.slug)}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              categorySlug === c.slug
                ? "bg-ink-900 text-white"
                : "border border-ink-200 bg-white text-ink-700 hover:bg-ink-50"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const img = firstImageUrl(p.images);
          const price = p.price_usd != null ? Number(p.price_usd) : null;
          return (
            <li key={p.id}>
              <Link
                href={`/products/${encodeURIComponent(p.slug)}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="aspect-[4/3] w-full bg-ink-100">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt="" className="h-full w-full object-cover transition group-hover:scale-[1.02]" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-ink-400">No image</div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-teal-600">
                    {p.category?.name ?? "—"}
                  </p>
                  <h2 className="mt-1 font-heading text-lg font-semibold text-ink-900 group-hover:text-brand-secondary">
                    {p.name}
                  </h2>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-ink-600">{p.description || "—"}</p>
                  <p className="mt-3 text-base font-bold text-ink-900">
                    {price != null && Number.isFinite(price)
                      ? price.toLocaleString(undefined, { style: "currency", currency: "USD" })
                      : "—"}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {products.length === 0 ? (
        <p className="mt-12 text-center text-sm text-ink-500">No products in this category yet.</p>
      ) : null}
    </div>
  );
}
