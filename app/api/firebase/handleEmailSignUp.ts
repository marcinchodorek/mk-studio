import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./clientConfig.client";

const handleEmailSignUp = async (email: string, password: string) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  return await user.getIdToken();
};

export default handleEmailSignUp;
