import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Link } from "@remix-run/react";
import { SlashIcon } from "@radix-ui/react-icons";

type DynamicBreadcrumbItemProps = {
  paths: string[];
  path: string;
  index: number;
};

export default function DynamicBreadcrumbItem({
  paths,
  path,
  index,
}: DynamicBreadcrumbItemProps) {
  return (
    <>
      <BreadcrumbItem key={path}>
        <BreadcrumbLink asChild>
          <Link to={`/${paths.slice(0, index + 1).join("/")}`}>
            <p className="capitalize">{path}</p>
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      {index !== paths.length - 2 && (
        <BreadcrumbSeparator>
          <SlashIcon />
        </BreadcrumbSeparator>
      )}
    </>
  );
}
