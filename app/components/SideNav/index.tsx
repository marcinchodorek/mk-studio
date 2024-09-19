import { Link, useLocation } from "@remix-run/react";
import { twMerge } from "tailwind-merge";

type SideNavProps = {
  children: React.ReactNode;
};

const mainNavItems = [
  { name: "Home", href: "/" },
  { name: "Contacts", href: "/contacts" },
  // { name: "Calendar", href: "/calendar" },
  // { name: "Statistics", href: "/statistics" },
];

export default function SideNav({ children }: SideNavProps) {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <aside className="flex bg-muted/40 border-r border-gray-200 p-4 shadow-sm">
        <nav className="flex flex-col gap-y-4">
          {mainNavItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={twMerge(
                "flex items-center gap-x-2 w-fit p-2 text-sm font-medium text-gray-900 hover:text-gray-100 hover:bg-gray-600 focus:text-gray-100 focus:bg-gray-600 transition-all rounded-md cursor-pointer",
                // pathname === item.href && "bg-gray-800 text-gray-100",
                pathname === item.href && "bg-gray-800 text-gray-100",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
      {children}
    </div>
  );
}
