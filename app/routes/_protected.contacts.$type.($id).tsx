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
  formatPhoneNumberIntl,
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
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useTranslation } from "react-i18next";

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
  phoneNumber: z.string().refine(isValidPhoneNumber, {
    message: "contacts_form_phone_number_validation_error",
  }),
  name: z.string().min(1, { message: "contacts_form_name_validation_error" }),
  lastName: z
    .string()
    .min(1, { message: "contacts_form_last_name_validation_error" }),
});

type FormData = z.infer<typeof ContactsSchema>;
const resolver = zodResolver(ContactsSchema);

export default function AddContact() {
  const { t } = useTranslation();
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

  const [name, lastName, phoneNumber] = form.watch([
    "name",
    "lastName",
    "phoneNumber",
  ]);

  const isSubmitting = useMemo(
    () => state === "submitting" || form.formState.isSubmitting,
    [state, form.formState.isSubmitting],
  );

  return (
    <div className="flex gap-4 flex-col md:flex-row">
      <Form {...(form as unknown as UseFormReturn<FormData>)}>
        <RemixForm method="post" className="w-full lg:w-1/2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("contacts_form_name_label")}</FormLabel>
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
                <FormLabel>{t("contacts_form_last_name_label")}</FormLabel>
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
                  <FormLabel>{t("contacts_form_phone_number_label")}</FormLabel>
                  <FormControl>
                    <PhoneInput
                      placeholder={t("contacts_form_phone_number_placeholder")}
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
          <Button
            data-testid="create-contact"
            className="mt-4"
            disabled={isSubmitting}
          >
            {t(isAddContactPage ? "btn_add_contact" : "btn_edit_contact")}
          </Button>
        </RemixForm>
      </Form>
      <Card className="mx-auto w-full gap-4 md:w-1/3 h-fit self-center">
        <CardHeader>
          <CardTitle>{t("contacts_form_user_data_title")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <p className="font-bold">{t("contacts_form_name_label")}:</p>
            <p>{`${name} ${lastName}`}</p>
          </div>
          <div>
            <p className="font-bold">
              {t("contacts_form_phone_number_label")}:
            </p>
            <p>{formatPhoneNumberIntl(phoneNumber)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
