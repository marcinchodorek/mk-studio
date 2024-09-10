import { useContext } from "react";

import { ToastContext } from "~/context/ToastProvider";

const useToastProvider = () => useContext(ToastContext);

export default useToastProvider;
