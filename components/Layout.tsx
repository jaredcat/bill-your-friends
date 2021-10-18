import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Service } from '../interfaces';

type Props = {
  children?: ReactNode;
  title?: string;
  services?: Service[];
};

const Layout = ({
  children,
  title = 'This is the default title',
  services = [],
}: Props) => (
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
        {services.length > 0
          ? services.map((service: Service): JSX.Element => {
              return (
                <React.Fragment key={service.name}>
                  {' '}
                  |{' '}
                  <Link href={`/${service.name}`}>
                    <a>{service.name}</a>
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

export default Layout;
