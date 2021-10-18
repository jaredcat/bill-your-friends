import Link from 'next/link';
import Layout from '../components/Layout';
import { Data, Service } from '../interfaces';

const data: Data = require('../data.json');

const IndexPage = () => {
  const { services } = data;
  const enabledServices = services.filter(
    (service: Service) =>
      service.enabled && Object.keys(service.tiers).length > 0,
  );

  return (
    <Layout
      services={enabledServices}
      title="Home | Next.js + TypeScript Example">
      <h1>Hello Next.js 👋</h1>
    </Layout>
  );
};

export default IndexPage;
