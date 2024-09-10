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
import handleGoogleSignIn from "~/api/firebase/handleGoogleSignIn";
import admin from "~/api/firebase/serverConfig.server";
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
import { Label } from "~/components/ui/label";

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

  const handleLogInOnClick = async () => {
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
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input id="password" type="password" required />
            <div className="flex items-center">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
            </div>
            <Input id="confirmPassword" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Sign up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
