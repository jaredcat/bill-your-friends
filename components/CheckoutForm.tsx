import React, { useState, useEffect } from 'react';
import { Stripe } from '@stripe/stripe-js';

import SubscriptionButton from '../components/SubscriptionButton';
import StripeTestCards from '../components/StripeTestCards';

import getStripe from '../utils/get-stripejs';
import { fetchPostJSON } from '../utils/api-helpers';
import * as config from '../config';
import { Tiers, Tier } from '../interfaces';

type Params = {
  name: string;
  tiers: Tiers;
};

const CheckoutForm = ({ name = '', tiers = {} }: Params) => {
  const [stripePromise] = useState<Promise<Stripe>>(getStripe());
  const [loading, setLoading] = useState(false);

  const handleClick = async (amount: number, priceId: string) => {
    setLoading(true);
    // Create a Checkout Session.
    const response = await fetchPostJSON('/api/checkout_sessions', {
      amount,
      priceId,
    });

    if (response.statusCode === 500) {
      console.error(response.message);
      return;
    }
    const stripe = await stripePromise;
    // Redirect to Checkout.
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
    setLoading(false);
  };

  const SubscriptionButtons = Object.entries(tiers).map(
    ([frequency, { price, priceId }]) => {
      return (
        <SubscriptionButton
          key={priceId}
          handleClick={() => handleClick(price, priceId)}
          price={price}
          frequency={frequency}
        />
      );
    },
  );

  return <>{SubscriptionButtons}</>;
  // <form onSubmit={handleSubmit}>
  //   <StripeTestCards />
  //   <br />
  //   {SubscriptionButtons}
  //   <input
  //     type="radio"
  //     value={FREQUENCIES.MONTHLY}
  //     id={FREQUENCIES.MONTHLY}
  //     onChange={handleInputChange}
  //     name="frequency"
  //   />
  //   <label htmlFor={FREQUENCIES.MONTHLY}>
  //     {formatAmountForDisplay(COSTS[FREQUENCIES.MONTHLY], config.CURRENCY)} (
  //     {FREQUENCIES.MONTHLY})
  //   </label>
  //   <button
  //     className="checkout-style-background"
  //     type="submit"
  //     disabled={loading || !frequency}>
  //     Subscribe for ${COSTS[frequency]}
  //   </button>
  // </form>
};

export default CheckoutForm;

const calculateRates = (pricePerMonth: number) => {};
