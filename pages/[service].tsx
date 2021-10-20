import Layout from '../components/Layout';

import CheckoutForm from '../components/CheckoutForm';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Data, Service } from '../interfaces';
import { getEnabledServices } from '../utils/get-enabled-services';
import { useEffect } from 'react';

const ServicePage = (props: Service) => {
  const { name, tiers, color, updateTheme } = props;
  useEffect(() => updateTheme({ backgroundColor: color }), [color]);
  return (
    <Layout title={`${name} | Next.js + TypeScript Example`}>
      <h1>{name}</h1>
      <CheckoutForm
        service={name}
        slug={encodeURIComponent(name.toLowerCase())}
        tiers={tiers}
      />
    </Layout>
  );
};

export default ServicePage;

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;
  const data: Data = require('../data.json');
  const service: Service = data.services.find(
    (service) =>
      encodeURIComponent(service.name.toLowerCase()) === params.service,
  );
  return {
    props: {
      ...service,
    }, // will be passed to the page component as props
  };
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  const enabledServices = getEnabledServices();
  const slugs = enabledServices.map((enabledService) => enabledService.slug);

  const newPaths = [];
  // Add params to every slug obj returned from api
  for (let slug of slugs) {
    newPaths.push({ params: { service: slug } });
  }

  return {
    paths: newPaths, //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};
