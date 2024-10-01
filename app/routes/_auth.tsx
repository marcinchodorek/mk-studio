import { Outlet } from "@remix-run/react";
import ThemeToggle from "~/components/theme-toggle";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getSessionCookie } from "~/api/auth/sessionCookie";
import { admin } from "~/api/firebase/serverConfig.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionCookieValue = await getSessionCookie(request);

  try {
    await admin.auth().verifySessionCookie(sessionCookieValue, true);

    if (sessionCookieValue) {
      return redirect("/");
    }

    return null;
  } catch (e) {
    return null;
  }
}

export default function AuthLayout() {
  return (
    <div className="h-screen flex flex-col">
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>
      <Outlet />
    </div>
  );
}
