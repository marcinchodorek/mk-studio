import { Users, Calendar, Home, Cog, LucideIcon } from "lucide-react";

import { useDeviceContext } from "~/hooks";
import { useTranslation } from "react-i18next";
import DesktopNav from "~/components/desktop-nav";
import MobileNav from "~/components/mobile-nav";

export type NavigationItem = {
  name: string;
  path: string;
  Icon: LucideIcon;
};

type SideNavProps = {
  isSideNavOpen: boolean;
  toggleSideNavState: () => void;
};

export default function SideNav({
  isSideNavOpen,
  toggleSideNavState,
}: SideNavProps) {
  const { t } = useTranslation();
  const { isDesktopView } = useDeviceContext();

  const navigationItems = [
    { name: t("nav_home_title"), path: "/", Icon: Home },
    { name: t("nav_contacts_title"), path: "/contacts", Icon: Users },
    { name: t("nav_scheduler_title"), path: "/scheduler", Icon: Calendar },
    { name: t("nav_settings_title"), path: "/settings", Icon: Cog },
  ];

  return isDesktopView ? (
    <DesktopNav
      isSideNavOpen={isSideNavOpen}
      toggleSideNavState={toggleSideNavState}
      navigationItems={navigationItems}
    />
  ) : (
    <MobileNav
      isSideNavOpen={isSideNavOpen}
      toggleSideNavState={toggleSideNavState}
      navigationItems={navigationItems}
    />
  );
}
