import { z } from "zod";

export const checkoutCartItemSchema = z.object({
  programmeId: z.string().min(1),
  programmeTitle: z.string().min(1).max(200),
  quantity: z.number().int().min(1).max(200),
  attendeeCount: z.number().int().min(1).max(500),
  deliveryMode: z.enum(["virtual", "onsite", "hybrid"]),
  hubType: z.enum(["standard", "executive", "custom"]).default("standard"),
  durationDays: z.number().int().min(1).max(365),
  selectedAddons: z.array(z.string()).default([]),
  promoCode: z.string().trim().max(50).optional().default(""),
});

export const checkoutCustomerSchema = z.object({
  email: z.string().email(),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  companyName: z.string().trim().min(1).max(200),
  phone: z.string().trim().max(50).optional().default(""),
});

export const checkoutRequestSchema = z.object({
  cart: z.array(checkoutCartItemSchema).min(1).max(100),
  customer: checkoutCustomerSchema,
  currency: z.enum(["zar", "usd", "gbp"]).default("zar"),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  orderReference: z.string().trim().max(100).optional(),
});

export type CheckoutCartItemInput = z.infer<typeof checkoutCartItemSchema>;
export type CheckoutCustomerInput = z.infer<typeof checkoutCustomerSchema>;
export type CheckoutRequestInput = z.infer<typeof checkoutRequestSchema>;

export type PricedCartItem = CheckoutCartItemInput & {
  unitAmountMinor: number;
  lineTotalMinor: number;
  pricingBreakdown: {
    baseAmountMinor: number;
    addonsAmountMinor: number;
    discountAmountMinor: number;
  };
};

export type CheckoutPricingResult = {
  currency: "zar" | "usd" | "gbp";
  items: PricedCartItem[];
  subtotalMinor: number;
  discountTotalMinor: number;
  grandTotalMinor: number;
};
