import { CheckoutClient } from "./CheckoutClient";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-ink-900">Checkout</h1>
      <p className="mt-2 text-sm text-ink-600">Review your cart and enter shipping details. Payment is mocked.</p>
      <div className="mt-8">
        <CheckoutClient />
      </div>
    </div>
  );
}
