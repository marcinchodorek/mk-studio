import { useContext } from 'react';

import { SnackbarContext } from '~/context/SnackbarProvider';

const useSnackbar = () => useContext(SnackbarContext);

export default useSnackbar;
