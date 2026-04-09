"use client";

import { useState } from "react";

type CheckoutCartItem = {
  programmeId: string;
  programmeTitle: string;
  quantity: number;
  attendeeCount: number;
  deliveryMode: "virtual" | "onsite" | "hybrid";
  hubType: "standard" | "executive" | "custom";
  durationDays: number;
  selectedAddons: string[];
  promoCode?: string;
};

type CheckoutCustomer = {
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  phone?: string;
};

type CreateSessionResponse = {
  ok: boolean;
  url?: string | null;
  error?: string;
};

const demoCart: CheckoutCartItem[] = [
  {
    programmeId: "leadership-management-development",
    programmeTitle: "Leadership Management Development",
    quantity: 1,
    attendeeCount: 12,
    deliveryMode: "onsite",
    hubType: "executive",
    durationDays: 2,
    selectedAddons: ["certification", "catering"],
    promoCode: "SPRINGBOK10",
  },
];

export default function CheckoutPage() {
  const [customer, setCustomer] = useState<CheckoutCustomer>({
    email: "",
    firstName: "",
    lastName: "",
    companyName: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleCheckout(): Promise<void> {
    setLoading(true);
    setMessage("");

    try {
      const successUrl = `${window.location.origin}/checkout/success`;
      const cancelUrl = `${window.location.origin}/checkout`;

      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-idempotency-key": crypto.randomUUID(),
        },
        body: JSON.stringify({
          cart: demoCart,
          customer,
          currency: "zar",
          successUrl,
          cancelUrl,
          orderReference: `SBK-${Date.now()}`,
        }),
      });

      const data = (await response.json()) as CreateSessionResponse;

      if (!response.ok || !data.ok) {
        setMessage(data.error ?? "Unable to create checkout session.");
        setLoading(false);
        return;
      }

      if (!data.url) {
        setMessage("Checkout session created, but no redirect URL was returned.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unexpected checkout error.";
      setMessage(errorMessage);
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-semibold">Checkout</h1>
      <p className="mt-2 text-sm text-gray-600">
        Review your details and continue to secure payment.
      </p>

      <div className="mt-8 grid gap-4">
        <input
          className="rounded border p-3"
          placeholder="First name"
          value={customer.firstName}
          onChange={(e) =>
            setCustomer((prev) => ({ ...prev, firstName: e.target.value }))
          }
        />
        <input
          className="rounded border p-3"
          placeholder="Last name"
          value={customer.lastName}
          onChange={(e) =>
            setCustomer((prev) => ({ ...prev, lastName: e.target.value }))
          }
        />
        <input
          className="rounded border p-3"
          placeholder="Company name"
          value={customer.companyName}
          onChange={(e) =>
            setCustomer((prev) => ({ ...prev, companyName: e.target.value }))
          }
        />
        <input
          className="rounded border p-3"
          placeholder="Email"
          type="email"
          value={customer.email}
          onChange={(e) =>
            setCustomer((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <input
          className="rounded border p-3"
          placeholder="Phone"
          value={customer.phone ?? ""}
          onChange={(e) =>
            setCustomer((prev) => ({ ...prev, phone: e.target.value }))
          }
        />

        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading}
          className="rounded bg-black px-4 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Creating secure checkout..." : "Proceed to payment"}
        </button>

        {message ? <p className="text-sm text-red-600">{message}</p> : null}
      </div>
    </main>
  );
}
