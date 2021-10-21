import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';

import { getEnabledServices } from '../utils/get-enabled-services';

type Props = {
  children?: ReactNode;
  title?: string;
  backgroundColor?: string;
};

const enabledServices = getEnabledServices();

const Layout = ({ children, title = 'This is the default title' }: Props) => {
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
          {enabledServices.length > 0
            ? enabledServices.map(({ name, slug }): JSX.Element => {
                return (
                  <React.Fragment key={slug}>
                    {' '}
                    |{' '}
                    <Link href={`/${slug}`}>
                      <a>{name}</a>
                    </Link>
                  </React.Fragment>
                );
              })
            : null}
        </nav>
      </header>
      {children}
      <footer>
        <hr />
        <span>I'm here to stay (Footer)</span>
      </footer>
    </div>
  );
};

export default Layout;
