import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductAddToCart } from "@/components/store/ProductAddToCart";
import { firstImageUrl, loadStoreProductBySlug } from "@/lib/shop/catalog";

export const dynamic = "force-dynamic";

type Props = { params: { slug: string } };

export default async function ProductDetailPage({ params }: Props) {
  const product = await loadStoreProductBySlug(params.slug);
  if (!product) notFound();

  const img = firstImageUrl(product.images);
  const price = product.price_usd != null ? Number(product.price_usd) : null;
  const priceUsd = price != null && Number.isFinite(price) ? price : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <nav className="text-sm text-ink-500">
        <Link href="/products" className="hover:text-brand-secondary">
          Store
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink-800">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-ink-200 bg-ink-50">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt="" className="h-full w-full object-contain" />
          ) : (
            <div className="flex aspect-square items-center justify-center text-ink-400">No image</div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-teal-600">{product.category?.name ?? "—"}</p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-ink-900">{product.name}</h1>
          <p className="mt-4 text-2xl font-bold text-ink-900">
            {price != null && Number.isFinite(price)
              ? price.toLocaleString(undefined, { style: "currency", currency: "USD" })
              : "—"}
          </p>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink-700">{product.description || ""}</p>
          <p className="mt-2 text-xs text-ink-500">In stock: {product.stock}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ProductAddToCart
              productId={product.id}
              slug={product.slug}
              title={product.name}
              priceUsd={priceUsd}
              imageUrl={img}
              maxQty={product.stock}
            />
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center rounded-xl border border-ink-300 px-5 py-3 text-sm font-semibold text-ink-800 hover:bg-ink-50"
            >
              Go to checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
