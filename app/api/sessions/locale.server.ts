import {
  createCookie,
  createCookieSessionStorage,
  redirect,
} from "@remix-run/node";

const isProduction = process.env.NODE_ENV === "production";

export const localeCookie = createCookie("locale", {
  httpOnly: true,
  secure: isProduction,
  path: "/",
  maxAge: 365 * 24 * 60 * 60,
});
