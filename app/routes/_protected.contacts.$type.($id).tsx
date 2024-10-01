import {
  Form as RemixForm,
  json,
  useLoaderData,
  useNavigation,
  useParams,
} from "@remix-run/react";
import { ActionFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useRemixForm } from "remix-hook-form";
import { UseFormReturn } from "react-hook-form";
import {
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input/min";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useMemo } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { PhoneInput } from "~/components/phone-input";
import { Button } from "~/components/ui/button";
import saveNewContact from "~/api/firebase/contacts/saveNewContact.server";
import getContactById from "~/api/firebase/contacts/getContactById.server";
import updateContactById from "~/api/firebase/contacts/updateContactById.server";
import { Contact } from "~/api/firebase/contacts/types.server";

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  if (id) {
    const contact = (await getContactById(id)) as Contact[];
    return json(contact[0]);
  } else {
    return null;
  }
}

const querySchema = z.object({
  id: z.string().optional(),
  type: z.string(),
});

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const { id, type } = querySchema.parse(params);

  console.log(type);
  console.log(formData);

  const contactsBody = {
    name: formData.get("name") as string,
    lastName: formData.get("lastName") as string,
    fullName: `${formData.get("name")} ${formData.get("lastName")}`,
    phoneNumber:
      parsePhoneNumber(formData.get("phoneNumber") as string)?.number || "",
  };

  switch (type) {
    case "edit":
      await updateContactById(id, contactsBody);
      break;
    case "add":
      await saveNewContact(contactsBody);
      break;
    default:
      break;
  }

  return redirect("/contacts");
};

const ContactsSchema = z.object({
  phoneNumber: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  name: z.string().min(1, { message: "Name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
});

type FormData = z.infer<typeof ContactsSchema>;
const resolver = zodResolver(ContactsSchema);

export default function AddContact() {
  const { type } = useParams();
  const { state } = useNavigation();
  const contactData = useLoaderData<Contact>();
  const isAddContactPage = useMemo(() => type === "add", [type]);

  const form = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      name: contactData?.name ?? "",
      lastName: contactData?.lastName ?? "",
      phoneNumber: contactData?.phoneNumber ?? "",
    },
  });

  const isSubmitting = useMemo(
    () => state === "submitting" || form.formState.isSubmitting,
    [state, form.formState.isSubmitting],
  );

  return (
    <Form {...(form as unknown as UseFormReturn<FormData>)}>
      <RemixForm method="post" className="w-full lg:w-1/2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <PhoneInput
                    placeholder="Enter a phone number"
                    defaultCountry="PL"
                    international
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button className="mt-4" disabled={isSubmitting}>
          {isAddContactPage ? "Add Contact" : "Edit Contact"}
        </Button>
      </RemixForm>
    </Form>
  );
}
