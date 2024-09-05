import { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';

import { auth } from '~/api/firebase/clientConfig.client';

interface AuthContextModel {
  user: User | null;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextModel>({
  user: null,
});

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthContextModel['user']>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
