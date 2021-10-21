import Layout from '../components/Layout';

import CheckoutForm from '../components/CheckoutForm';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Data, Service } from '../interfaces';
import { getEnabledServices } from '../utils/get-enabled-services';
import { useEffect } from 'react';
import loadData from '../utils/load-data';

type Props = Service & {
  slug: string;
};

const ServicePage = (props: Props) => {
  const { name, tiers, color, updateTheme, slug } = props;
  useEffect(() => updateTheme({ backgroundColor: color }), [color]);
  return (
    <Layout title={`${name} | Next.js + TypeScript Example`}>
      <h1>{name}</h1>
      <CheckoutForm service={name} slug={slug} tiers={tiers} />
    </Layout>
  );
};

export default ServicePage;

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;
  const data: Data = loadData();

  const service: Service = data.services.find(
    ({ slug }) => slug === params.service,
  );

  return {
    props: {
      ...service,
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
    fallback: 'blocking', //indicates the type of fallback
  };
};
