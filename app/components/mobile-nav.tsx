import { Link, useLocation } from "@remix-run/react";
import { twMerge } from "tailwind-merge";
import { buttonVariants } from "~/components/ui/button";

import { NavigationItem } from "~/components/side-nav";

type MobileNavProps = {
  isSideNavOpen: boolean;
  toggleSideNavState: () => void;
  navigationItems: NavigationItem[];
};

export default function MobileNav({
  isSideNavOpen,
  toggleSideNavState,
  navigationItems,
}: MobileNavProps) {
  const { pathname } = useLocation();

  return (
    <aside
      className={twMerge(
        "flex h-[calc(100vh-56px)] bg-muted border-r border-gray-200 p-4 shadow-sm absolute transition-all z-10 w-3/4",
        isSideNavOpen ? "translate-x-[-110%]" : "translate-x-0",
      )}
    >
      <nav className="flex flex-col gap-y-4 mt-10">
        {navigationItems.map((item) => (
          <Link
            to={item.path}
            onClick={toggleSideNavState}
            className={twMerge(
              buttonVariants({
                variant: pathname === item.path ? "default" : "ghost",
              }),
              "flex justify-start gap-1",
            )}
          >
            <item.Icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
