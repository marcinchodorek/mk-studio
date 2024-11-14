import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { admin } from "../firebase/serverConfig.server";

type SessionBody = {
  __session: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionBody>({
    cookie: {
      name: "__session",
      maxAge: 60 * 60 * 24 * 5, // 5 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      secrets: [process.env.AUTH_COOKIE_SECRET!],
    },
  });

export const getSessionCookie = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("__session") as string;
};

export const handleCreateCookieAndRedirect = async (
  request: Request,
  idToken: string,
) => {
  const session = await getSession(request.headers.get("Cookie"));
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  await admin.auth().verifyIdToken(idToken);
  const sessionToken = await admin
    .auth()
    .createSessionCookie(idToken, { expiresIn });

  session.set("__session", sessionToken);
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export const handleClearSession = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export const handleLogoutAndRedirect = async (request: Request) => {
  try {
    const idToken = await getSessionCookie(request);
    await admin.auth().verifySessionCookie(idToken, true);

    return await handleClearSession(request);
  } catch (e) {
    return await handleClearSession(request);
  }
};
