import type {
  CheckoutCartItemInput,
  CheckoutPricingResult,
  PricedCartItem,
} from "@/lib/payments/types";

const PROGRAMME_BASE_RATES_ZAR: Record<string, number> = {
  "leadership-management-development": 125000,
  "supervisory-skills": 85000,
  "customer-service-excellence": 65000,
};

const ADDON_RATES_ZAR: Record<string, number> = {
  certification: 12000,
  catering: 18000,
  travel_support: 25000,
  extended_support: 15000,
};

function getProgrammeBaseAmount(item: CheckoutCartItemInput): number {
  const fallback = 75000;
  const base = PROGRAMME_BASE_RATES_ZAR[item.programmeId] ?? fallback;

  const deliveryMultiplier =
    item.deliveryMode === "virtual"
      ? 1
      : item.deliveryMode === "hybrid"
        ? 1.15
        : 1.3;

  const hubMultiplier =
    item.hubType === "executive"
      ? 1.2
      : item.hubType === "custom"
        ? 1.35
        : 1;

  const durationMultiplier = Math.max(1, item.durationDays);

  return Math.round(base * deliveryMultiplier * hubMultiplier * durationMultiplier);
}

function getAddonsAmount(item: CheckoutCartItemInput): number {
  return item.selectedAddons.reduce((sum, addon) => {
    return sum + (ADDON_RATES_ZAR[addon] ?? 0);
  }, 0);
}

function getDiscountAmount(
  item: CheckoutCartItemInput,
  basePlusAddons: number,
): number {
  let discount = 0;

  if (item.attendeeCount >= 10) {
    discount += Math.round(basePlusAddons * 0.05);
  }

  if (item.attendeeCount >= 25) {
    discount += Math.round(basePlusAddons * 0.08);
  }

  const promo = (item.promoCode ?? "").trim().toUpperCase();
  if (promo === "SPRINGBOK10") {
    discount += Math.round(basePlusAddons * 0.1);
  }

  return Math.min(discount, basePlusAddons);
}

function convertCurrencyFromZar(
  amount: number,
  currency: "zar" | "usd" | "gbp",
): number {
  if (currency === "zar") return amount;

  const fxRate = currency === "usd" ? 18.5 : 23.5;
  return Math.round(amount / fxRate);
}

export function priceCart(
  cart: CheckoutCartItemInput[],
  currency: "zar" | "usd" | "gbp",
): CheckoutPricingResult {
  const items: PricedCartItem[] = cart.map((item) => {
    const baseZar = getProgrammeBaseAmount(item);
    const addonsZar = getAddonsAmount(item);
    const preDiscountZar = baseZar + addonsZar;
    const discountZar = getDiscountAmount(item, preDiscountZar);

    const unitAmountZar = Math.max(preDiscountZar - discountZar, 0);
    const lineTotalZar = unitAmountZar * item.quantity;

    return {
      ...item,
      unitAmountMinor: convertCurrencyFromZar(unitAmountZar, currency),
      lineTotalMinor: convertCurrencyFromZar(lineTotalZar, currency),
      pricingBreakdown: {
        baseAmountMinor: convertCurrencyFromZar(baseZar, currency),
        addonsAmountMinor: convertCurrencyFromZar(addonsZar, currency),
        discountAmountMinor: convertCurrencyFromZar(discountZar, currency),
      },
    };
  });

  const subtotalMinor = items.reduce(
    (sum, item) =>
      sum +
      (item.pricingBreakdown.baseAmountMinor + item.pricingBreakdown.addonsAmountMinor) *
        item.quantity,
    0,
  );

  const discountTotalMinor = items.reduce(
    (sum, item) => sum + item.pricingBreakdown.discountAmountMinor * item.quantity,
    0,
  );

  const grandTotalMinor = items.reduce((sum, item) => sum + item.lineTotalMinor, 0);

  return {
    currency,
    items,
    subtotalMinor,
    discountTotalMinor,
    grandTotalMinor,
  };
}
