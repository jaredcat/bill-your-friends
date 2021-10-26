import { useState } from "react";
import { Stripe } from "@stripe/stripe-js";

import SubscriptionButton from "../components/SubscriptionButton";
// import StripeTestCards from '../components/StripeTestCards';

import { Tiers } from "../interfaces";
import styled from "@emotion/styled";
import { checkout } from "../utils/stripe-helpers";

type Params = {
  slug: string;
  serviceName: string;
  tiers: Tiers;
  isSlotsLeft: boolean;
  customerId?: string;
  setPopupIsOpen: Function;
};

const SubscribeWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const CheckoutForm = ({
  slug = "",
  tiers = {},
  isSlotsLeft = true,
  customerId = "",
  setPopupIsOpen,
}: Params) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (priceId: string) => {
    setLoading(true);

    if (customerId) {
      setPopupIsOpen(true);
    } else {
      await checkout(priceId, slug, customerId);
    }

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
          disabled={!isSlotsLeft || loading}
        />
      );
    }
  );

  return <SubscribeWrapper>{SubscriptionButtons}</SubscribeWrapper>;
};

export default CheckoutForm;
