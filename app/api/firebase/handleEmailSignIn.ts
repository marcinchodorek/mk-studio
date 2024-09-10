import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./clientConfig.client";

const handleEmailSignIn = async (email: string, password: string) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);

  return await user.getIdToken();
};

export default handleEmailSignIn;
