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

import { useCustomFetcher, useUserContext } from "~/hooks";
import { Link } from "@remix-run/react";

type TopBarProps = {
  children: React.ReactNode;
};

const getAvatarName = (name?: string | null) => {
  if (!name) {
    return "";
  }
  const names = name.split(" ");
  return names[0][0] + names[1][0];
};

export default function TopBar({ children }: TopBarProps) {
  const { user } = useUserContext();
  const { submit: handleUserLogout } = useCustomFetcher();

  const handleLogout = () => {
    handleUserLogout(
      {},
      {
        action: "/logout",
        method: "post",
      },
    );
  };

  return (
    <>
      <div className="w-full h-14 p-4 bg-gray-100 flex items-center justify-between">
        <Link to="/" className="font-bold">
          studio-mk
        </Link>
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={user?.photoURL || ""} />
                <AvatarFallback>
                  {getAvatarName(user?.displayName)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Log out</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to log out?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {children}
    </>
  );
}
