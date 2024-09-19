import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Form as RemixForm } from "@remix-run/react/dist/components";
import { Input } from "~/components/ui/input";
import { PhoneInput } from "~/components/PhoneInput";
import { Button } from "~/components/ui/button";
import { useRemixForm } from "remix-hook-form";
import { ActionFunction } from "@remix-run/node";
import saveNewContact from "~/api/firebase/contacts/saveNewContact.server";
import { json } from "@remix-run/react";
import z from "zod";
import { isValidPhoneNumber } from "react-phone-number-input/min";
import { zodResolver } from "@hookform/resolvers/zod";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const contactsBody = {
    name: formData.get("name") as string,
    lastName: formData.get("lastName") as string,
    fullName: `${formData.get("name")} ${formData.get("lastName")}`,
    phoneNumber: formData.get("phoneNumber") as string,
  };
  await saveNewContact(contactsBody);

  return json({ success: true });
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
  const form = useRemixForm<FormData>({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      name: "",
      lastName: "",
      phoneNumber: "",
    },
  });

  return (
    <div className="p-4">
      {/*// @ts-ignore*/}
      <Form {...form}>
        <RemixForm onSubmit={form.handleSubmit} method="post">
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <PhoneInput
                    placeholder="Enter a phone number"
                    defaultCountry="PL"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full mt-2">Add Contact</Button>
        </RemixForm>
      </Form>
    </div>
  );
}
