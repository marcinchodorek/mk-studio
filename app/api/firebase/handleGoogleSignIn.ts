import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from './clientConfig.client';

const handleGoogleSignIn = async () => {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  return await user.getIdToken();
};

export default handleGoogleSignIn;
