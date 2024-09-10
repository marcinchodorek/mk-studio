import { createContext } from "react";
import { useToast } from "~/hooks/use-toast";

export type ToastVariants = "destructive" | "default" | null | undefined;

interface ToastContextModel {
  showToast: (
    message: string,
    variant?: ToastVariants,
    duration?: number,
  ) => void;
}

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastContext = createContext<ToastContextModel>({
  showToast: () => {},
});

const ToastProvider = ({ children }: ToastProviderProps) => {
  const { toast } = useToast();

  const showToast: ToastContextModel["showToast"] = (
    message,
    variant = "default",
    duration = 5000,
  ) => {
    toast({
      title: message,
      variant,
      duration,
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
