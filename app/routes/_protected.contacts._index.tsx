import { json, Link, useLoaderData } from "@remix-run/react";
import getContactsQuery from "~/api/firebase/contacts/getContactsQuery.server";

import { Button, buttonVariants } from "~/components/ui/button";
import { DataTable } from "~/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { twMerge } from "tailwind-merge";

type Contact = {
  name: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
};

export async function loader() {
  const contacts = await getContactsQuery();
  return json(contacts);
}

export const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      const isSorted = !!column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown
            className={twMerge("ml-2 h-4 w-4", isSorted && "text-blue-400")}
          />
        </Button>
      );
    },
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      const isSorted = !!column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Name
          <ArrowUpDown
            className={twMerge("ml-2 h-4 w-4", isSorted && "text-blue-400")}
          />
        </Button>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Button variant="ghost" className="h-8 w-8 p-0">
          Schedule an appointment
        </Button>
      );
    },
  },
];

export default function Contacts() {
  const contacts = useLoaderData<Contact[]>();

  return (
    <div className="p-4 w-full">
      <div className="flex justify-end">
        <Link
          to={"/contacts/add"}
          className={buttonVariants({ variant: "default" })}
        >
          Add Contact
        </Link>
      </div>
      <DataTable columns={columns} data={contacts} withFilter />
    </div>
  );
}
