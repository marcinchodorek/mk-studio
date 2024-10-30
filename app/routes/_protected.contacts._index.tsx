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
import { ActionFunctionArgs } from "@remix-run/node";
import deleteContactById from "~/api/firebase/contacts/deleteContactById.server";
import { ReturnLoaderResponse } from "~/constants/types";
import { useTranslation } from "react-i18next";

type Contact = {
  id: string;
  name: string;
  lastName: string;
  fullName: string;
  phoneNumber: string;
};

export async function loader() {
  const { contacts } = await getContactsQuery();
  return json(contacts);
}

type ContactsLoader = typeof loader;
type ContactsResponse = ReturnLoaderResponse<ContactsLoader>;

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const id = formData.get("id") as string;

  await deleteContactById(id);

  return null;
}

export default function Contacts() {
  const { t } = useTranslation();
  const contacts = useLoaderData<ContactsResponse>();
  const { submit } = useFetcher();

  const handleDeleteContactById = useCallback(
    (id: string) => {
      submit(
        { id },
        {
          method: "delete",
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
        header: t("inf_contacts_phone_number"),
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
                  <Button variant="ghost" data-testid="contact-actions">
                    <EllipsisVertical />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link
                      data-testid="actions-schedule"
                      to={`/scheduler/${rowId}`}
                    >
                      Schedule
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      data-testid="actions-edit"
                      to={`/contacts/edit/${rowId}`}
                    >
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" asChild>
                    <AlertDialogTrigger
                      className="w-full"
                      data-testid="actions-delete"
                    >
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
                    data-testid="actions-delete-confirm"
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
          data-testid="add-contact"
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
