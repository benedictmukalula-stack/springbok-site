import Stripe from "stripe";
import type {
  CheckoutCustomerInput,
  CheckoutPricingResult,
} from "@/lib/payments/types";

type BuildCheckoutSessionParams = {
  pricing: CheckoutPricingResult;
  customer: CheckoutCustomerInput;
  successUrl: string;
  cancelUrl: string;
  orderReference?: string;
};

export function buildLineItems(
  pricing: CheckoutPricingResult,
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  return pricing.items.map((item) => ({
    quantity: item.quantity,
    price_data: {
      currency: pricing.currency,
      unit_amount: item.unitAmountMinor,
      product_data: {
        name: item.programmeTitle,
        description: [
          `Attendees: ${item.attendeeCount}`,
          `Mode: ${item.deliveryMode}`,
          `Duration: ${item.durationDays} day(s)`,
          item.selectedAddons.length > 0
            ? `Add-ons: ${item.selectedAddons.join(", ")}`
            : "Add-ons: none",
        ].join(" | "),
        metadata: {
          programmeId: item.programmeId,
          hubType: item.hubType,
        },
      },
    },
  }));
}

export function validateLineItems(
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
): void {
  if (lineItems.length === 0) {
    throw new Error("No line items were generated.");
  }

  const hasInvalidItem = lineItems.some((lineItem) => {
    if (!lineItem.price_data) return true;
    if (typeof lineItem.price_data.unit_amount !== "number") return true;
    if (lineItem.price_data.unit_amount <= 0) return true;
    if (!lineItem.quantity || lineItem.quantity <= 0) return true;
    return false;
  });

  if (hasInvalidItem) {
    throw new Error("One or more line items are invalid.");
  }
}

export function buildCheckoutSessionPayload({
  pricing,
  customer,
  successUrl,
  cancelUrl,
  orderReference,
}: BuildCheckoutSessionParams): Stripe.Checkout.SessionCreateParams {
  const line_items = buildLineItems(pricing);
  validateLineItems(line_items);

  return {
    mode: "payment",
    line_items,
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    customer_email: customer.email,
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    allow_promotion_codes: true,
    metadata: {
      customerEmail: customer.email,
      customerName: `${customer.firstName} ${customer.lastName}`,
      companyName: customer.companyName,
      orderReference: orderReference ?? "",
      itemCount: String(pricing.items.length),
      grandTotalMinor: String(pricing.grandTotalMinor),
      currency: pricing.currency,
    },
  };
}
