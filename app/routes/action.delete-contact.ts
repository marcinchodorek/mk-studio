import { ActionFunctionArgs, redirect } from "@remix-run/node";
import deleteContactById from "~/api/firebase/contacts/deleteContactById.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const id = formData.get("id") as string;

  await deleteContactById(id);

  return redirect("/contacts");
}
