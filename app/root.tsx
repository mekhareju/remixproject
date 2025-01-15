import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";

export function links() {
  return [
    { rel: "stylesheet", href: "/styles/Navbar.css" },
    { rel: "stylesheet", href: "/styles/Footer.css" },
    { rel: 'stylesheet', href: '/styles/App.css' },
    { rel: 'stylesheet', href: '/styles/index.css' }
  ];
}

export function meta() {
  return { title: "Gift Shop", description: "Your one-stop shop for unique gifts!" };
}

export default function Root() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar />
        <Outlet /> 
        <Footer />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
