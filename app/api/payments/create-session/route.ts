import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const items = body.items || [];

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "No items provided for checkout." },
        { status: 400 }
      );
    }

    // Build line items safely
    const line_items = items.map((item: any) => {
      const amount = Number(item?.price || 0);

      return {
        price_data: {
          currency: "usd", // change later if needed
          product_data: {
            name: item?.name || "Training Programme",
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: Number(item?.quantity || 1),
      };
    });

    // Validate amounts
    const invalidItem = line_items.some(
      (item: any) => item.price_data.unit_amount <= 0
    );

    if (invalidItem) {
      return NextResponse.json(
        { error: "One or more checkout items have an invalid amount." },
        { status: 400 }
      );
    }

    // MOCK session response (replace with Stripe later)
    return NextResponse.json({
      success: true,
      message: "Checkout session created successfully.",
      data: {
        redirectUrl: "/checkout/success",
      },
    });
  } catch (error: any) {
    console.error("Payment session error:", error);

    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
