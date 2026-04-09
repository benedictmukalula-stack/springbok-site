"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Programme } from "@/data/programmes";

type Props = {
  programme: Programme;
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

export default function ProgrammePricingCalculator({ programme }: Props) {
  const router = useRouter();
  const [attendeeCount, setAttendeeCount] = useState(1);
  const [message, setMessage] = useState("");

  const total = useMemo(() => {
    return programme.basePrice * attendeeCount;
  }, [programme.basePrice, attendeeCount]);

  function handleCheckout() {
    setMessage("");

    if (!programme.title || !programme.slug) {
      setMessage("Programme details are incomplete.");
      return;
    }

    if (!Number.isFinite(total) || total <= 0) {
      setMessage("Programme pricing is not available.");
      return;
    }

    const cartItem = {
      programmeTitle: programme.title,
      slug: programme.slug,
      attendeeCount,
      quantity: 1,
      currency: programme.currency,
      pricing: {
        total,
        currency: programme.currency,
      },
    };

    localStorage.setItem("kcg-cart", JSON.stringify([cartItem]));
    router.push("/checkout");
  }

  return (
    <section className="rounded-2xl border p-6">
      <h3 className="text-xl font-semibold">Pricing Calculator</h3>
      <p className="mt-2 text-sm text-gray-600">
        Adjust attendee count to estimate total cost.
      </p>

      {message ? (
        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {message}
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">Programme</p>
          <p className="mt-1 font-medium">{programme.title}</p>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm text-gray-500">Per attendee</p>
          <p className="mt-1 font-medium">
            {formatMoney(programme.basePrice, programme.currency)}
          </p>
        </div>

        <div className="rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Attendees</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAttendeeCount((prev) => Math.max(1, prev - 1))}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border"
              >
                -
              </button>

              <div className="min-w-[64px] rounded-xl border px-4 py-2 text-center font-semibold">
                {attendeeCount}
              </div>

              <button
                type="button"
                onClick={() => setAttendeeCount((prev) => prev + 1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-gray-50 p-4">
          <div className="flex items-center justify-between font-semibold">
            <span>Total estimate</span>
            <span>{formatMoney(total, programme.currency)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCheckout}
          className="inline-flex w-full items-center justify-center rounded-xl bg-black px-4 py-3 text-sm font-medium text-white"
        >
          Proceed to checkout
        </button>
      </div>
    </section>
  );
}
