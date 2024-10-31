import { Link } from "@remix-run/react";
import { User, Menu } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

import ThemeToggle from "~/components/theme-toggle";
import { useCustomFetcher, useDeviceContext, useUserContext } from "~/hooks";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";

type TopBarProps = {
  toggleSideNavState: () => void;
};

const getAvatarFallback = (name?: string | null) => {
  if (!name) {
    return <User />;
  }
  const names = name.split(" ");
  return names[0][0] + names[1][0];
};

export default function TopBar({ toggleSideNavState }: TopBarProps) {
  const { t } = useTranslation();
  const { user } = useUserContext();
  const { submit: handleUserLogout } = useCustomFetcher();
  const { isDesktopView } = useDeviceContext();

  const handleLogout = () => {
    handleUserLogout(
      {},
      {
        action: "/action/logout",
        method: "post",
      },
    );
  };

  return (
    <div className="w-full h-14 p-4 bg-muted/40 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {!isDesktopView && (
          <Button variant="ghost" size="icon" onClick={toggleSideNavState}>
            <Menu />
          </Button>
        )}
        <Link to="/" className="font-bold">
          studio-mk
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={user?.photoURL || ""} />
                <AvatarFallback>
                  {getAvatarFallback(user?.displayName)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                {t("nav_account_dropdown_title")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>{t("nav_logout_option")}</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("nav_logout_confirmation_title")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("nav_logout_confirmation_message")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("btn_cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                {t("btn_confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
