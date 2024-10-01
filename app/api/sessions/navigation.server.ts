import { createCookieSessionStorage, redirect } from "@remix-run/node";

const isProduction = process.env.NODE_ENV === "production";

const { getSession, commitSession } = createCookieSessionStorage({
  cookie: {
    name: "navigation",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["s3cr3t"],
    ...(isProduction
      ? { domain: "your-production-domain.com", secure: true }
      : {}),
  },
});

export const getNavigationSessionCookie = async (request: Request) => {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("navigation") as boolean;
};

export const setNavigationSessionCookie = async (
  request: Request,
  isSideNavOpen: boolean,
) => {
  const session = await getSession(request.headers.get("Cookie"));
  session.set("navigation", isSideNavOpen);
  return new Response(null, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};
