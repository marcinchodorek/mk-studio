import { useState } from "react";
import { Link, useLocation } from "@remix-run/react";
import { twMerge } from "tailwind-merge";
import { Button, buttonVariants } from "~/components/ui/button";
import { Users, Calendar, Home, ChevronRight, Cog } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useCustomFetcher } from "~/hooks";
import { useTranslation } from "react-i18next";

type SideNavProps = {
  children: React.ReactNode;
  isSideNavOpen: boolean;
};

export default function SideNav({ children, isSideNavOpen }: SideNavProps) {
  const { t } = useTranslation();
  const [isOpened, setIsOpened] = useState(isSideNavOpen);
  const { pathname } = useLocation();
  const { submit } = useCustomFetcher();

  const mainNavItems = [
    { name: t("nav.home"), path: "/", Icon: Home },
    { name: t("nav.contacts"), path: "/contacts", Icon: Users },
    { name: t("nav.scheduler"), path: "/scheduler", Icon: Calendar },
    { name: t("nav.settings"), path: "/settings", Icon: Cog },
  ];

  const handleNavigationCollapsedStorage = () => {
    setIsOpened((prevState) => !prevState);
    submit({}, { method: "POST", action: "/action/set-navigation" });
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <aside
        className={twMerge(
          "flex bg-muted/40 border-r border-gray-200 p-4 shadow-sm relative transition-all",
          isOpened ? "w-44" : "w-18 px-2",
        )}
      >
        <Button variant="ghost" className="absolute top-2 right-2 p-0">
          <ChevronRight
            className={twMerge(
              "h-6 w-6 transition-transform",
              isOpened ? "rotate-180" : "rotate-0",
            )}
            onClick={handleNavigationCollapsedStorage}
          />
        </Button>
        <TooltipProvider>
          <nav className="flex flex-col gap-y-4 mt-10">
            {mainNavItems.map((item) => (
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
                    {isOpened && item.name}
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
      {children}
    </div>
  );
}
