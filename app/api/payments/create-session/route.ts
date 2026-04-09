import { NextResponse } from "next/server";

type CheckoutItem = {
  name?: string;
  price?: number | string;
  quantity?: number | string;
};

type StripeLikeLineItem = {
  price_data: {
    currency: string;
    product_data: {
      name: string;
    };
    unit_amount: number;
  };
  quantity: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items: CheckoutItem[] = Array.isArray(body?.items) ? body.items 
: [];

    if (items.length === 0) {
      return NextResponse.json(
        { error: "No items provided for checkout." },
        { status: 400 }
      );
    }

    const line_items: StripeLikeLineItem[] = items.map((item: 
CheckoutItem) => {
      const amount = Number(item?.price ?? 0);
      const quantity = Number(item?.quantity ?? 1);

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item?.name?.trim() || "Training Programme",
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 
1,
      };
    });

    const hasInvalidAmount = line_items.some(
      (item: StripeLikeLineItem) => item.price_data.unit_amount <= 0
    );

    if (hasInvalidAmount) {
      return NextResponse.json(
        { error: "One or more checkout items have an invalid amount." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Checkout session created successfully.",
      data: {
        redirectUrl: "/checkout/success",
        lineItemsCount: line_items.length,
      },
    });
  } catch (error) {
    console.error("Payment session error:", error);

    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
