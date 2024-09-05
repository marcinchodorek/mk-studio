import {
  ActionFunction,
  json,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import {
  getSessionCookie,
  handleCreateCookieAndRedirect,
} from '~/api/auth/sessionCookie';

import handleGoogleSignIn from '~/api/firebase/handleGoogleSignIn';
import admin from '~/api/firebase/serverConfig.server';
import { useCustomFetcher } from '~/hooks';

export const action: ActionFunction = async ({ request }) => {
  const idToken = (await request.formData()).get('idToken') as string;
  try {
    return await handleCreateCookieAndRedirect(request, idToken);
  } catch (error) {
    console.error('Error creating session cookie:', error);
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
};

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionCookieValue = await getSessionCookie(request);

  try {
    await admin.auth().verifySessionCookie(sessionCookieValue, true);

    if (sessionCookieValue) {
      return redirect('/');
    }

    return null;
  } catch (e) {
    return null;
  }
}

export default function Login() {
  const { submit: handleLogInFetcher } = useCustomFetcher();

  const handleLogInOnClick = async () => {
    try {
      const idToken = await handleGoogleSignIn();

      handleLogInFetcher(
        { idToken },
        {
          action: '.',
          method: 'post',
        }
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="font-sans p-4">
      <button type="button" onClick={handleLogInOnClick}>
        Sign In with Google
      </button>
    </div>
  );
}
