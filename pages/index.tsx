import Link from 'next/link'
import Layout from '../components/Layout'
import getStripe from '../utils/get-stripejs'

import CheckoutForm from '../components/CheckoutForm';

const IndexPage = () => {
return (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1>Hello Next.js 👋</h1>
    <CheckoutForm />
  </Layout>)
}

export default IndexPage
