import Layout from '../components/Layout';
import { useRouter } from 'next/router';

import CheckoutForm from '../components/CheckoutForm';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Data, Service } from '../interfaces';
import { getEnabledServices } from '../utils/get-enabled-services';
import React, { useEffect } from 'react';
import loadData from '../utils/load-data';
import Popup from '../components/Popup';

type Props = Service & {
  slug: string;
};

const ServicePage = (props: Props) => {
  const { name, tiers, color, updateTheme, slug } = props;
  const router = useRouter();
  const canceled: boolean = router.query.canceled === 'true';
  const success: boolean = router.query.success === 'true';

  useEffect(() => updateTheme({ backgroundColor: color }), [color]);

  return (
    <Layout title={`${name} | Next.js + TypeScript Example`}>
      <h1>{name}</h1>
      <CheckoutForm service={name} slug={slug} tiers={tiers} />
      {success && !canceled ? (
        <Popup header="Success!" subtitle="Manage Subscription">
          <form action="/customer-portal" method="POST">
            <button type="submit">Manage Billing</button>
            <button>Close</button>
          </form>
        </Popup>
      ) : null}
      {canceled ? (
        <Popup header="Canceled" subtitle="Your card was not charged">
          <button>Close</button>
        </Popup>
      ) : null}
    </Layout>
  );
};

export default ServicePage;

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;
  const { service } = params;
  const data: Data = loadData();

  const currentService: Service = data.services.find(
    ({ slug }) => slug === service,
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
