import { ActionFunction, json } from "@remix-run/node";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Link } from "@remix-run/react";

import { handleCreateCookieAndRedirect } from "~/api/auth/sessionCookie";
import handleGoogleSignIn from "~/api/firebase/handleGoogleSignIn";
import { useCustomFetcher } from "~/hooks";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import handleEmailSignIn from "~/api/firebase/handleEmailSignIn";
import { PASSWORD_REGEX } from "~/constants";

const EmailLogInFormSchema = z.object({
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
});

type FormData = z.infer<typeof EmailLogInFormSchema>;
const resolver = zodResolver(EmailLogInFormSchema);

export const action: ActionFunction = async ({ request }) => {
  const idToken = (await request.formData()).get("idToken") as string;
  try {
    return await handleCreateCookieAndRedirect(request, idToken);
  } catch (error) {
    console.error("Error creating session cookie:", error);
    return json({ error: "Unauthorized" }, { status: 401 });
  }
};

export default function _authLogin() {
  const { submit: handleLogInFetcher } = useCustomFetcher();
  const form = useForm<FormData>({ resolver });

  const handleEmailSignInOnSubmit = async ({ email, password }: FormData) => {
    try {
      const idToken = await handleEmailSignIn(email, password);

      handleLogInFetcher(
        { idToken },
        {
          action: ".",
          method: "post",
        },
      );
    } catch (e) {
      form.setError("email", {
        message: "Invalid email or password",
      });
    }
  };

  const handleGoogleLogInOnClick = async () => {
    try {
      const idToken = await handleGoogleSignIn();

      handleLogInFetcher(
        { idToken },
        {
          action: ".",
          method: "post",
        },
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Card className="m-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEmailSignInOnSubmit)}>
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
              <Button className="w-full mt-2">Login</Button>
            </form>
          </Form>
          <Button
            onClick={handleGoogleLogInOnClick}
            variant="outline"
            className="w-full"
          >
            Login with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/sign-up" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
