import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getBaseUrl(req: NextRequest) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl) return envUrl.replace(/\/$/, "");

  const host = req.headers.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function POST(req: NextRequest) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY in environment variables." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey);
    const body = await req.json();
    const items = Array.isArray(body?.items) ? body.items : [];

    if (!items.length) {
      return NextResponse.json(
        { error: "No checkout items were supplied." },
        { status: 400 }
      );
    }

    const currency = String(
      items[0]?.currency || items[0]?.pricing?.currency || "ZAR"
    ).toLowerCase();

    const line_items = items.map((item: any, index: number) => {
      const rawAmount = Number(item?.pricing?.total ?? 0);
      const safeAmount = Number.isFinite(rawAmount) && rawAmount > 0 ? rawAmount : 0;

      return {
        price_data: {
          currency,
          product_data: {
            name: item?.programmeTitle || `Programme ${index + 1}`,
          },
          unit_amount: Math.round(safeAmount * 100),
        },
        quantity: 1,
      };
    });

    if (line_items.some((item) => item.price_data.unit_amount <= 0)) {
      return NextResponse.json(
        { error: "One or more checkout items have an invalid amount." },
        { status: 400 }
      );
    }

    const baseUrl = getBaseUrl(req);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${baseUrl}/checkout?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?status=cancelled`,
    });

    return NextResponse.json({
      ok: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe session creation failed:", error);

    return NextResponse.json(
      { error: "Unable to create payment session." },
      { status: 500 }
    );
  }
}
