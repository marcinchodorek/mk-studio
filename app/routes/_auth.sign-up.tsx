import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunction, json } from "@remix-run/node";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

import { handleCreateCookieAndRedirect } from "~/api/auth/sessionCookie";
import { useCustomFetcher } from "~/hooks";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Link } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { PASSWORD_REGEX } from "~/constants";
import handleEmailSignUp from "~/api/firebase/handleEmailSignUp";
import { useTranslation } from "react-i18next";

const EmailSignUpFormSchema = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .email()
      .min(1, { message: "Email is required" }),
    password: z
      .string({ required_error: "Password must be at least 8 characters" })
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(PASSWORD_REGEX, {
        message: "Password must contain at least one uppercase letter",
      }),
    confirmPassword: z
      .string({ required_error: "Password must be at least 8 characters" })
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(PASSWORD_REGEX, {
        message: "Password must contain at least one uppercase letter",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords are not equal",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof EmailSignUpFormSchema>;
const resolver = zodResolver(EmailSignUpFormSchema);

export const action: ActionFunction = async ({ request }) => {
  const idToken = (await request.formData()).get("idToken") as string;
  try {
    return await handleCreateCookieAndRedirect(request, idToken);
  } catch (error) {
    console.error("Error creating session cookie:", error);
    return json({ error: "Unauthorized" }, { status: 401 });
  }
};

export default function SignUp() {
  const { t } = useTranslation();
  const { submit: handleLogInFetcher } = useCustomFetcher();
  const form = useForm<FormData>({ resolver });

  const handleEmailSignUpOnSubmit = async ({ email, password }: FormData) => {
    try {
      const idToken = await handleEmailSignUp(email, password);

      handleLogInFetcher(
        { idToken },
        {
          action: ".",
          method: "post",
        },
      );
    } catch (e) {
      form.setError("email", {
        message: "User with that email already exists",
      });
    }
  };

  return (
    <Card className="m-auto max-w-sm">
      <CardHeader>
        <Link to="/login" className="ml-auto flex items-center gap-2 text-xs">
          <ArrowLeftIcon />
          {t("login_back_to_login")}
        </Link>
        <CardTitle className="text-2xl">{t("login_sign_up")}</CardTitle>
        <CardDescription>{t("login_provide_email_info")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEmailSignUpOnSubmit)}>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("login_email_input_label")}</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("login_password_input_label")}</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("login_confirm_password_input_label")}
                      </FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button className="w-full mt-2">{t("login_sign_up")}</Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
