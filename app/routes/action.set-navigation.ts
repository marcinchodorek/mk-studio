import { ActionFunctionArgs } from "@remix-run/node";
import {
  getNavigationSessionCookie,
  setNavigationSessionCookie,
} from "~/api/sessions/navigation.server";

export async function action({ request }: ActionFunctionArgs) {
  const isSideNavOpen = await getNavigationSessionCookie(request);
  return setNavigationSessionCookie(request, !isSideNavOpen);
}
