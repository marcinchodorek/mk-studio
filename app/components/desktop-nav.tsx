import { Link, useLocation } from "@remix-run/react";
import { twMerge } from "tailwind-merge";
import { Button, buttonVariants } from "~/components/ui/button";
import { ChevronRight } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useCustomFetcher } from "~/hooks";
import { NavigationItem } from "~/components/side-nav";

type DesktopNavProps = {
  isSideNavOpen: boolean;
  toggleSideNavState: () => void;
  navigationItems: NavigationItem[];
};

export default function DesktopNav({
  isSideNavOpen,
  toggleSideNavState,
  navigationItems,
}: DesktopNavProps) {
  const { pathname } = useLocation();
  const { submit } = useCustomFetcher();

  const handleNavigationCollapsedStorage = () => {
    toggleSideNavState();
    submit({}, { method: "POST", action: "/action/set-navigation" });
  };

  return (
    <aside
      className={twMerge(
        "flex h-[calc(100vh-56px)] bg-muted/40 border-r border-gray-200 p-4 shadow-sm relative transition-all",
        isSideNavOpen ? "w-44" : "w-18 px-2",
      )}
    >
      <Button variant="ghost" className="absolute top-2 right-2 p-0">
        <ChevronRight
          className={twMerge(
            "h-6 w-6 transition-transform",
            isSideNavOpen ? "rotate-180" : "rotate-0",
          )}
          onClick={handleNavigationCollapsedStorage}
        />
      </Button>
      <TooltipProvider>
        <nav className="flex flex-col gap-y-4 mt-10">
          {navigationItems.map((item) => (
            <Tooltip key={item.name}>
              <TooltipTrigger>
                <Link
                  to={item.path}
                  className={twMerge(
                    buttonVariants({
                      variant: pathname === item.path ? "default" : "ghost",
                    }),
                    "flex justify-start gap-1",
                  )}
                >
                  <item.Icon className="h-5 w-5" />
                  {isSideNavOpen && item.name}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </TooltipProvider>
    </aside>
  );
}
