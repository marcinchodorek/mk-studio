import { useFetcher } from '@remix-run/react';
import useSnackbar from './useSnackbar';
import { useEffect } from 'react';

export default function useCustomFetcher<T>(
  opts?: Parameters<typeof useFetcher>[0]
) {
  const { showSnackbar } = useSnackbar();
  const fetcher = useFetcher<T>(opts);

  // TODO add error handling for snackbar

  return fetcher;
}
