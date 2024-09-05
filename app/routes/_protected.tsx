import { Outlet, redirect } from '@remix-run/react';
import { LoaderFunctionArgs } from '@remix-run/node';

import { getSessionCookie, handleClearSession } from '~/api/auth/sessionCookie';
import admin from '~/api/firebase/serverConfig.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionCookieValue = await getSessionCookie(request);

  if (!sessionCookieValue) {
    return redirect('/login');
  }

  try {
    await admin.auth().verifySessionCookie(sessionCookieValue, true);
    return null;
  } catch (error) {
    console.error('Session verification failed:', error);
    return await handleClearSession(request);
  }
}

export default function ProtectedLayout() {
  return <Outlet />;
}
