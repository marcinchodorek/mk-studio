import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from "remix-themes";
import clsx from "clsx";

import { Toaster } from "~/components/ui/toaster";
import LoaderWrapper from "~/components/global/loader-wrapper";
import { themeSessionResolver } from "~/api/sessions/theme.server";
import AuthProvider from "./context/AuthProvider";
import ToastProvider from "./context/ToastProvider";

import "./tailwind.css";

export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request);

  return json({
    theme: getTheme(),
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

export function App() {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();

  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body>
        <AuthProvider>
          <ToastProvider>
            <LoaderWrapper>
              <Outlet />
            </LoaderWrapper>
          </ToastProvider>
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

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();

  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  );
}
