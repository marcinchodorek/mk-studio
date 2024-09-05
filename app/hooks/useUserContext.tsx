import { useContext } from 'react';
import { AuthContext } from '~/context/AuthProvider';

const useUserContext = () => {
  return useContext(AuthContext);
};

export default useUserContext;
