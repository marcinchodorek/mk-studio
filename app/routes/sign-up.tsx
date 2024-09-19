import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionFunction,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

import {
  getSessionCookie,
  handleCreateCookieAndRedirect,
} from "~/api/auth/sessionCookie";
import { admin } from "~/api/firebase/serverConfig.server";
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

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionCookieValue = await getSessionCookie(request);

  try {
    await admin.auth().verifySessionCookie(sessionCookieValue, true);

    if (sessionCookieValue) {
      return redirect("/");
    }

    return null;
  } catch (e) {
    return null;
  }
}

export default function SignUp() {
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
    <Card className="mx-auto my-10 max-w-sm">
      <CardHeader>
        <Link to="/login" className="ml-auto flex items-center gap-2 text-xs">
          <ArrowLeftIcon />
          Back to Login
        </Link>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
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
                      <FormLabel>Email</FormLabel>
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
                      <FormLabel>Password</FormLabel>
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
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button className="w-full mt-2">Sign up</Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
