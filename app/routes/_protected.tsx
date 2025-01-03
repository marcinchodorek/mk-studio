import { json, Outlet, redirect, useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";

import { getSessionCookie, handleClearSession } from "~/api/auth/sessionCookie";
import { admin } from "~/api/firebase/serverConfig.server";
import SideNav from "~/components/side-nav";
import TopBar from "~/components/top-bar";
import { getNavigationSessionCookie } from "~/api/sessions/navigation.server";
import DynamicBreadcrumbs from "~/components/dynamic-breadcrumbs";
import { useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useDeviceContext } from "~/hooks";

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionCookieValue = await getSessionCookie(request);
  const isSideNavCollapsed = await getNavigationSessionCookie(request);

  if (!sessionCookieValue) {
    return redirect("/login");
  }

  try {
    await admin.auth().verifySessionCookie(sessionCookieValue, true);
    return json({ isSideNavCollapsed });
  } catch (error) {
    console.error("Session verification failed:", error);
    return await handleClearSession(request);
  }
}

export default function ProtectedLayout() {
  const { isSideNavCollapsed } = useLoaderData<typeof loader>();
  const { isDesktopView } = useDeviceContext();
  const [isOpened, setIsOpened] = useState(
    isDesktopView && !isSideNavCollapsed,
  );

  const toggleSideNavState = useCallback(() => {
    setIsOpened((prevState) => !prevState);
  }, []);

  return (
    <>
      <TopBar toggleSideNavState={toggleSideNavState} />
      <div className="flex">
        <SideNav
          isSideNavOpen={isOpened}
          toggleSideNavState={toggleSideNavState}
        />
        <div
          className={twMerge(
            "w-full flex flex-col p-4 overflow-auto h-[calc(100vh-56px)]",
          )}
        >
          {/*<DynamicBreadcrumbs />*/}
          <Outlet />
        </div>
      </div>
    </>
  );
}
