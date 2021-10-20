import React, { useState, useEffect } from 'react';
import { Stripe } from '@stripe/stripe-js';

import SubscriptionButton from '../components/SubscriptionButton';
import StripeTestCards from '../components/StripeTestCards';

import getStripe from '../utils/get-stripejs';
import { fetchPostJSON } from '../utils/api-helpers';
import { Tiers, Tier } from '../interfaces';
import styled from '@emotion/styled';

type Params = {
  slug: string;
  service: string;
  tiers: Tiers;
};

const SubscribeWrapper = styled.div`
  display: flex;
`;

const CheckoutForm = ({ service = '', slug = '', tiers = {} }: Params) => {
  const [stripePromise] = useState<Promise<Stripe>>(getStripe());
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (priceId: string) => {
    setLoading(true);
    // Create a Checkout Session.
    const response = await fetchPostJSON('/api/create-checkout-session', {
      priceId,
      service,
      slug,
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
          handleClick={() => handleSubmit(priceId)}
          price={price}
          frequency={frequency}
          loading={loading}
        />
      );
    },
  );

  return <SubscribeWrapper>{SubscriptionButtons}</SubscribeWrapper>;
  // <form onSubmit={handleSubmit}>

  // </form>;
};

export default CheckoutForm;

const calculateRates = (pricePerMonth: number) => {};
