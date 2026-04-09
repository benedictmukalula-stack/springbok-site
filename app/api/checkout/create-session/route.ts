import { NextRequest, NextResponse } from "next/server";
import { checkoutRequestSchema } from "@/lib/payments/types";
import { priceCart } from "@/lib/payments/pricing";
import { getStripe } from "@/lib/payments/stripe";
import { buildCheckoutSessionPayload } from "@/lib/payments/session";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const rawBody: unknown = await request.json();
    const parsed = checkoutRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid checkout payload.",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { cart, customer, currency, successUrl, cancelUrl, orderReference } =
      parsed.data;

    const pricing = priceCart(cart, currency);

    if (pricing.grandTotalMinor <= 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Checkout total must be greater than zero.",
        },
        { status: 400 },
      );
    }

    const stripe = getStripe();
    const payload = buildCheckoutSessionPayload({
      pricing,
      customer,
      successUrl,
      cancelUrl,
      orderReference,
    });

    const idempotencyKey =
      request.headers.get("x-idempotency-key") ??
      `checkout_${customer.email}_${orderReference ?? crypto.randomUUID()}`;

    const session = await stripe.checkout.sessions.create(payload, {
      idempotencyKey,
    });

    return NextResponse.json(
      {
        ok: true,
        sessionId: session.id,
        url: session.url,
        pricing,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unexpected checkout error.";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
