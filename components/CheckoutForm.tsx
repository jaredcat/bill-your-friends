import React, { useState, useEffect } from 'react';
import { Stripe } from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';

import StripeTestCards from '../components/StripeTestCards';

import getStripe from '../utils/get-stripejs';
import { fetchPostJSON } from '../utils/api-helpers';
import { formatAmountForDisplay } from '../utils/stripe-helpers';
import * as config from '../config';

import {FREQUENCIES} from '../types'

const COSTS = {
  [FREQUENCIES.MONTHLY]: 10,
  [FREQUENCIES.SEMIANNUALLY]: 60,
  [FREQUENCIES.ANNUALLY]: 120
}

const SERVICE = "SPOTIFY"

const CheckoutForm = () => {
  const [stripePromise] = useState<Promise<Stripe>>(getStripe());
  const [loading, setLoading] = useState(false);
  const [frequency, setFrequency] = useState("");

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFrequency(FREQUENCIES[e.currentTarget.value.toUpperCase()]);
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Create a Checkout Session.
    const response = await fetchPostJSON('/api/checkout_sessions', {
      amount: COSTS[frequency],
      frequency,
      service: SERVICE
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


  return (
    <form onSubmit={handleSubmit}>
      <StripeTestCards />
      <Elements stripe={stripePromise} />
      Subscribe:<br />
      <input type="radio" value={FREQUENCIES.MONTHLY} id={FREQUENCIES.MONTHLY}
      onChange={handleInputChange} name="frequency" />
      <label htmlFor={FREQUENCIES.MONTHLY}>{formatAmountForDisplay(COSTS[FREQUENCIES.MONTHLY], config.CURRENCY)} ({FREQUENCIES.MONTHLY})</label>
      <br />
      <input type="radio" value={FREQUENCIES.SEMIANNUALLY} id={FREQUENCIES.SEMIANNUALLY}
      onChange={handleInputChange} name="frequency" />
      <label htmlFor={FREQUENCIES.SEMIANNUALLY}>{formatAmountForDisplay(COSTS[FREQUENCIES.SEMIANNUALLY], config.CURRENCY)} ({FREQUENCIES.SEMIANNUALLY})</label>
      <br />
      <input type="radio" value={FREQUENCIES.ANNUALLY} id={FREQUENCIES.ANNUALLY}
      onChange={handleInputChange} name="frequency" />
      <label htmlFor={FREQUENCIES.ANNUALLY}>{formatAmountForDisplay(COSTS[FREQUENCIES.ANNUALLY], config.CURRENCY)} ({FREQUENCIES.ANNUALLY})</label>

      <br />
      <button
        className="checkout-style-background"
        type="submit"
        disabled={loading || !frequency}
      >
        Subscribe for ${COSTS[frequency]}
      </button>
    </form>
  );
};

export default CheckoutForm;