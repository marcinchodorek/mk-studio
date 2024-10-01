import { ActionFunction } from '@remix-run/node';
import { signOut } from 'firebase/auth';
import {
  handleClearSession,
  handleLogoutAndRedirect,
} from '~/api/auth/sessionCookie';
import { auth } from '~/api/firebase/clientConfig.client';

export const action: ActionFunction = async ({ request }) => {
  try {
    await signOut(auth);
    return await handleLogoutAndRedirect(request);
  } catch (error) {
    console.error('Error during session logout:', error);
    return await handleClearSession(request);
  }
};
