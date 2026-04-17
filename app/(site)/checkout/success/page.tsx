import Link from "next/link";

type Props = { searchParams?: { orderId?: string } };

export default function CheckoutSuccessPage({ searchParams }: Props) {
  const id = searchParams?.orderId?.trim() || "";

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-mint/50 text-3xl">✓</div>
      <h1 className="font-heading text-2xl font-bold text-ink-900">Thank you!</h1>
      <p className="mt-3 text-sm text-ink-600">Your simulated payment succeeded. Order reference:</p>
      {id ? (
        <p className="mt-2 font-mono text-sm text-ink-800">{id}</p>
      ) : (
        <p className="mt-2 text-sm text-ink-500">(No order id in URL)</p>
      )}
      <Link href="/products" className="mt-8 inline-block font-semibold text-brand-secondary hover:underline">
        Continue shopping
      </Link>
    </div>
  );
}
