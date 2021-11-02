import React, { useEffect, useState } from "react";
import { GetStaticPaths, GetStaticProps, NextApiResponse } from "next";
import { useRouter } from "next/router";
import { Stripe as StripeNode } from "stripe";

import { fetchPostJSON } from "../utils/api-helpers";
import CheckoutForm from "../components/CheckoutForm";
import Layout from "../components/Layout";
import { Data, Service } from "../interfaces";
import { getEnabledServices } from "../utils/get-enabled-services";
import loadData from "../utils/load-data";
import Popup from "../components/Popup";
import ManageSubscriptionsButton from "../components/ManageSubscriptionsButton";

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
  }, [slug]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => updateTheme({ backgroundColor: color }), [color]);
  useEffect(() => setPopupIsOpen(success || canceled), [success, canceled]);

  const handleClickManageBilling = async (): Promise<void> => {
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

  return (
    <>
      <Layout title={`${name} | Next.js + TypeScript Example`} isBlur={isBlur}>
        <ManageSubscriptionsButton
          customerId={customerId}
          handleClickManageBilling={handleClickManageBilling}
          setPopupIsOpen={setPopupIsOpen}
        />
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
      <Popup
        customerId={customerId}
        success={success}
        canceled={canceled}
        handleClickManageBilling={handleClickManageBilling}
        popupIsOpen={popupIsOpen}
        setPopupIsOpen={setPopupIsOpen}
        slug={slug}
      />
    </>
  );
};

export default ServicePage;

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
