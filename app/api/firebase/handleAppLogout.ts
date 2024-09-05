import { signOut } from 'firebase/auth';

import { auth } from './clientConfig.client';

const handleAppLogout = async () => {
  try {
    await signOut(auth);
    await fetch('/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error signing out: ', error);
  }
};

export default handleAppLogout;
