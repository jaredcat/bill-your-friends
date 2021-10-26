import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Service } from '../interfaces';

import { getEnabledServices } from '../utils/get-enabled-services';

type Props = {
  children?: ReactNode;
  title: string;
  backgroundColor?: string;
};

const enabledServices = getEnabledServices();

const Layout = ({ children, title }: Props) => {
  let ServiceLinks: JSX.Element[] = [];
  if (enabledServices.length > 0) {
    ServiceLinks = generateHeaderLinks(enabledServices);
  }

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <nav>
          <Link href="/">
            <a>Home</a>
          </Link>
          {ServiceLinks}
        </nav>
      </header>
      {children}
      <footer>
        <span>I'm here to stay (Footer)</span>
      </footer>
    </div>
  );
};

export default Layout;

const generateHeaderLinks = (enabledServices: Service[]): JSX.Element[] => {
  const links = [
    <React.Fragment key="fixed">
      <br />
      <span>Offered Subscriptions: </span>
    </React.Fragment>,
  ];
  const separator = ` | `;
  for (let i = 0; i < enabledServices.length; i++) {
    const { slug, isSlotsLeft } = enabledServices[i];
    let name = <>{enabledServices[i].name}</>;
    if (!isSlotsLeft) name = <s>{name}</s>;
    links.push(
      <React.Fragment key={slug}>
        <Link href={`/${slug}`}>
          <a>{name}</a>
        </Link>
        {i !== enabledServices.length - 1 ? separator : null}
      </React.Fragment>,
    );
  }
  return links;
};
