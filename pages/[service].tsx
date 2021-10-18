import Link from 'next/link';
import Layout from '../components/Layout';

import CheckoutForm from '../components/CheckoutForm';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Data, Service } from '../interfaces';

const ServicePage = (props: Service) => {
  const { name, tiers } = props;
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <h1>{name.charAt(0).toUpperCase() + name.slice(1)}</h1>
      <CheckoutForm name={name} tiers={tiers} />
    </Layout>
  );
};

export default ServicePage;

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;
  const data: Data = require('../data.json');
  const service: Service = data.services.find(
    (service) => service.name === params.service,
  );
  return {
    props: {
      ...service,
    }, // will be passed to the page component as props
  };
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};
