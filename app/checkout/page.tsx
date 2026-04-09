"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type CheckoutItem = {
  programmeTitle?: string;
  slug?: string;
  attendeeCount?: number;
  quantity?: number;
  currency?: string;
  pricing?: {
    total?: number;
    currency?: string;
  };
};

function formatMoney(amount: number, currency = "ZAR") {
  try {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const status = searchParams.get("status");

    if (status === "success") {
      setMessage("Payment completed successfully.");
    } else if (status === "cancelled") {
      setMessage("Payment was cancelled.");
    }

    const raw = localStorage.getItem("kcg-cart");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setItems(parsed);
      }
    } catch {
      setItems([]);
    }
  }, [searchParams]);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.pricing?.total ?? 0), 0);
  }, [items]);

  const currency = items[0]?.currency || items[0]?.pricing?.currency || "ZAR";

  async function handlePayment() {
    setMessage("");

    if (!items.length) {
      setMessage("No cart item found.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/payments/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setLoading(false);
        setMessage(data.error || "Payment session creation failed.");
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      setLoading(false);
      setMessage("Payment session created, but no redirect URL was returned.");
    } catch (error) {
      console.error(error);
      setLoading(false);
      setMessage("Unable to start payment right now.");
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Checkout</h1>
          <p className="mt-2 text-sm text-gray-600">
            Review your order and continue to payment.
          </p>
        </div>

        <Link href="/" className="rounded-xl border px-4 py-2 text-sm font-medium">
          Return home
        </Link>
      </div>

      {message ? (
        <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {message}
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="rounded-2xl border p-6">
          <p className="font-medium">No cart item found.</p>
          <div className="mt-4">
            <Link
              href="/programmes"
              className="inline-flex rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
            >
              Browse programmes
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-2xl border p-6">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            <div className="mt-6 space-y-4">
              {items.map((item, index) => (
                <div key={`${item.slug || "item"}-${index}`} className="rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{item.programmeTitle || "Programme"}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        Attendees: {item.attendeeCount || 1}
                      </p>
                    </div>

                    <div className="font-semibold">
                      {formatMoney(Number(item.pricing?.total ?? 0), currency)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl border p-6">
            <h2 className="text-xl font-semibold">Payment</h2>

            <div className="mt-6 flex items-center justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatMoney(total, currency)}</span>
            </div>

            <button
              type="button"
              onClick={handlePayment}
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-black px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
            >
              {loading ? "Redirecting..." : "Proceed to payment"}
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}
