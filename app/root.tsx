import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Toaster } from "~/components/ui/toaster";

import AuthProvider from "./context/AuthProvider";
import ToastProvider from "./context/ToastProvider";
import "./tailwind.css";

export async function loader() {
  return json({
    ENV: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_APP_AUTH_DOMAIN: process.env.FIREBASE_APP_AUTH_DOMAIN,
      FIREBASE_APP_PROJECT_ID: process.env.FIREBASE_APP_PROJECT_ID,
      FIREBASE_APP_STORAGE_BUCKET: process.env.FIREBASE_APP_STORAGE_BUCKET,
      FIREBASE_APP_SENDER_ID: process.env.FIREBASE_APP_SENDER_ID,
    },
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
          <Toaster />
        </AuthProvider>
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
