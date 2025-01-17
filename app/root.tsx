import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
//import React from 'react';
import { LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';

import Footer from './components/Footer';
import Navbar from './components/Navbar';

//import styles from './styles/index.css';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
];

export const meta: MetaFunction = () => { return [ { title: 'My Gift Shop' } ]; };

export const loader: LoaderFunction = async () => {
  return {};
};

export default function Root() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        <title>My Gift Shop</title>
      </head>
      <body>
        <Navbar />
        <Outlet />
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
