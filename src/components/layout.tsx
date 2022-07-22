import React from 'react';
import Head from 'next/head';
import Navigation from './navigation';
import { useSession } from 'next-auth/react';

type Props = {
  title?: string;
  description?: string;
  children: React.ReactNode;
};

function Layout({
  title = 'App',
  description = 'Brian Nunez Instagram Clone',
  children,
}: Props) {
  return (
    <React.Fragment>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      {children}
    </React.Fragment>
  );
}

export default Layout;
