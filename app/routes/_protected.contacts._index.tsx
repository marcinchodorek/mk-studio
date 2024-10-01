import { json, Link, useFetcher, useLoaderData } from "@remix-run/react";
import getContactsQuery from "~/api/firebase/contacts/getContactsQuery.server";

import { Button, buttonVariants } from "~/components/ui/button";
import { DataTable } from "~/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, EllipsisVertical } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useCallback, useMemo } from "react";
import { formatPhoneNumberIntl } from "react-phone-number-input/min";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

type Contact = {
  id: string;
  name: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
};

export async function loader() {
  const contacts = await getContactsQuery();
  return json(contacts);
}

export default function Contacts() {
  const contacts = useLoaderData<Contact[]>();
  const { submit } = useFetcher();

  const handleDeleteContactById = useCallback(
    (id: string) => {
      submit(
        { id },
        {
          method: "delete",
          action: `/action/delete-contact`,
        },
      );
    },
    [submit],
  );

  const columns: ColumnDef<Contact>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => {
          const isSorted = !!column.getIsSorted();
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
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
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
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
        cell: ({ row }) => formatPhoneNumberIntl(row.original.phoneNumber),
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
          const rowId = row.original.id;
          return (
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <EllipsisVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link to={`/contacts/appointment-schedule/${rowId}`}>
                      Schedule
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/contacts/edit/${rowId}`}>Edit</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" asChild>
                    <AlertDialogTrigger className="w-full">
                      Delete
                    </AlertDialogTrigger>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Contact Delete</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this contact?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteContactById(rowId)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          );
        },
      },
    ],
    [handleDeleteContactById],
  );

  return (
    <>
      <div className="flex justify-end">
        <Link
          to={"/contacts/add"}
          className={buttonVariants({ variant: "default" })}
        >
          Add Contact
        </Link>
      </div>
      <DataTable columns={columns} data={contacts} withFilter />
    </>
  );
}
