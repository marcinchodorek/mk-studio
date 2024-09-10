import { useFetcher } from "@remix-run/react";
import useToastProvider from "./useToastProvider";
import { useEffect } from "react";

export default function useCustomFetcher<T>(
  opts?: Parameters<typeof useFetcher>[0],
) {
  const { showSnackbar } = useToastProvider();
  const fetcher = useFetcher<T>(opts);

  // TODO add error handling for snackbar

  return fetcher;
}
