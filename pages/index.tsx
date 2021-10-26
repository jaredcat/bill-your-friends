import Layout from "../components/Layout";
import { useEffect } from "react";

const IndexPage = ({ updateTheme }) => {
  useEffect(() => {
    updateTheme();
  }, []);
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <h1>Hello Next.js 👋</h1>
    </Layout>
  );
};

export default IndexPage;
