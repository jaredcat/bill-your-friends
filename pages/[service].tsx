import React, { useEffect, useState } from "react";
import { GetStaticPaths, GetStaticProps, NextApiResponse } from "next";
import { useRouter } from "next/router";
import { jsx } from "@emotion/react";
import { Stripe as StripeNode } from "stripe";

import { fetchPostJSON } from "../utils/api-helpers";
import CheckoutForm from "../components/CheckoutForm";
import Layout from "../components/Layout";
import { Data, Service } from "../interfaces";
import { getEnabledServices } from "../utils/get-enabled-services";
import loadData from "../utils/load-data";
import Popup from "../components/Popup";

type Props = Service & {
  slug: string;
};

type APIResponse = NextApiResponse &
  StripeNode.BillingPortal.Session & {
    message: string;
    statusCode: number;
  };

const ServicePage = (props: Props) => {
  const { name, tiers, color, updateTheme, slug, isSlotsLeft } = props;
  const [customerId, setCustomerId] = useState("");
  const router = useRouter();
  const canceled: boolean = router.query.canceled === "true";
  const success: boolean = router.query.success === "true";
  const sessionId: string = Array.isArray(router.query.session_id)
    ? router.query.session_id[0]
    : router.query.session_id;
  const [popupIsOpen, setPopupIsOpen] = useState(canceled || success);
  const isBlur: boolean = popupIsOpen;

  useEffect(() => {
    const customerId = window.localStorage.getItem(`${slug}-customer-id`);
    if (customerId && customerId !== "null") setCustomerId(customerId);
  }, []);
  useEffect(() => updateTheme({ backgroundColor: color }), [color]);
  useEffect(() => setPopupIsOpen(success || canceled), [success, canceled]);

  const closePopup = (): void => {
    setPopupIsOpen(false);
  };

  const handleClickManageBilling = async (
    customerId: string,
    sessionId: string
  ): Promise<void> => {
    // Create a Checkout Session.
    const response: APIResponse = await fetchPostJSON(
      "/api/create-customer-portal-session",
      {
        customerId,
        sessionId,
        slug,
      }
    );

    if (response.statusCode === 500) {
      console.error(response.statusMessage);
      return;
    } else {
      router.push(response.url);
    }
  };

  const popup = generatePopup(
    popupIsOpen,
    success,
    canceled,
    handleClickManageBilling,
    closePopup,
    sessionId,
    customerId
  );

  return (
    <>
      <Layout title={`${name} | Next.js + TypeScript Example`} isBlur={isBlur}>
        <h1>{name}</h1>
        <CheckoutForm
          serviceName={name}
          slug={slug}
          tiers={tiers}
          isSlotsLeft={isSlotsLeft}
          customerId={customerId}
          setPopupIsOpen={setPopupIsOpen}
        />
      </Layout>
      {popup}
    </>
  );
};

export default ServicePage;

const generatePopup = (
  popupIsOpen: boolean,
  success: boolean,
  canceled: boolean,
  handleClickManageBilling: Function,
  closePopup: React.MouseEventHandler,
  sessionId?: string,
  customerId?: string
) => {
  if (!popupIsOpen) return null;
  const state = {
    SUCCESS: success && !canceled,
    SUBSCRIBER_CANCELED: canceled && customerId,
    CANCELLED: canceled,
    SUBSCRIBER: !!customerId,
  };
  if (state.SUCCESS) {
    return (
      <Popup header="Success!" subtitle="Manage Subscription">
        <>
          {customerId ? (
            <button
              onClick={() => handleClickManageBilling(customerId, sessionId)}
            >
              Manage Billing
            </button>
          ) : null}
          <button onClick={closePopup}>Close</button>
        </>
      </Popup>
    );
  } else if (state.SUBSCRIBER_CANCELED) {
    return (
      <Popup header="Canceled" subtitle="Your subscription was not changed">
        <>
          <button
            onClick={() => handleClickManageBilling(customerId, sessionId)}
          >
            Manage Billing
          </button>
          <button onClick={closePopup}>Close</button>
        </>
      </Popup>
    );
  } else if (state.CANCELLED) {
    return (
      <Popup header="Canceled" subtitle="Your card was not charged">
        <button onClick={closePopup}>Close</button>
      </Popup>
    );
  } else if (state.SUBSCRIBER) {
    return (
      <Popup
        header="Already a subscriber"
        subtitle="You're currently a subscriber would you like to: "
      >
        <>
          <button onClick={closePopup}>Manage subscription</button>
          <button onClick={closePopup}>Add another subscription</button>
          <br />
          <button onClick={closePopup}>Close</button>
        </>
      </Popup>
    );
  }
  return null;
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;
  const { service } = params;
  const data: Data = loadData();

  const currentService: Service = data.services.find(
    ({ slug }) => slug === service
  );

  return {
    props: {
      ...currentService,
    }, // will be passed to the page component as props
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const enabledServices = getEnabledServices();

  // Add params to every slug obj returned from api
  const newPaths = enabledServices.map(({ slug }) => {
    return { params: { service: slug } };
  });

  return {
    paths: newPaths, //indicates that no page needs be created at build time
    fallback: false, //indicates the type of fallback
  };
};
