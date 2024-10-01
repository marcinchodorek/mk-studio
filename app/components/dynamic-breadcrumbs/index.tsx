import { useLocation } from "@remix-run/react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "~/components/ui/breadcrumb";
import DynamicBreadcrumbItem from "~/components/dynamic-breadcrumbs/dynamic-breadcrumb-item";

export default function DynamicBreadcrumbs() {
  const { pathname } = useLocation();
  const paths = pathname.split("/").filter((path) => path);

  if (pathname === "/") {
    // return (
    // <Breadcrumb className="mb-4">
    //   <BreadcrumbList>
    //     <BreadcrumbItem>
    //       <BreadcrumbLink href="/">Home</BreadcrumbLink>
    //     </BreadcrumbItem>
    //   </BreadcrumbList>
    // </Breadcrumb>
    // );
    return null;
  }

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {paths.slice(0, paths.length - 1).map((path, index) => (
          <DynamicBreadcrumbItem
            key={path}
            paths={paths}
            path={path}
            index={index}
          />
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
