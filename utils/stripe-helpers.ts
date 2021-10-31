import { Stripe as StripeNode } from "stripe";
import { NextApiResponse } from "next";

import { fetchPostJSON } from "./api-helpers";
import getStripe from "./get-stripejs";

export function formatAmountForDisplay(
  amount: number,
  currency: string
): string {
  const numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });
  return numberFormat.format(amount);
}

export function formatAmountForStripe(
  amount: number,
  currency: string
): number {
  const numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  for (const part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false;
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}

export async function checkout(
  priceId: string,
  slug: string,
  customerId?: string
): Promise<void> {
  type APIResponse = NextApiResponse &
    StripeNode.Checkout.Session & {
      message: string;
      statusCode: number;
    };
  // Create a Checkout Session.
  const response: APIResponse = await fetchPostJSON(
    "/api/create-checkout-session",
    {
      priceId,
      slug,
      customerId,
    }
  );

  if (response.statusCode === 500) {
    console.error(response.message);
    return;
  }

  if (response.customer && typeof response.customer === "string") {
    const newCustomerId: string = response.customer;
    window.localStorage.setItem(`${slug}-customer-id`, newCustomerId);
  }

  const stripe = await getStripe();
  // Redirect to Checkout.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { error } = await stripe!.redirectToCheckout({
    // Make the id field from the Checkout Session creation API response
    // available to this file, so you can provide it as parameter here
    // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
    sessionId: response.id,
  });
  // If `redirectToCheckout` fails due to a browser or network
  // error, display the localized error message to your customer
  // using `error.message`.
  console.warn(error.message);
}
