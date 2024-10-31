import { ReactNode, useMemo } from "react";
import { useNavigation } from "@remix-run/react";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const LoaderWrapper = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const { state } = useNavigation();
  const isLoading = useMemo(() => state === "loading", [state]);

  return (
    <div className="relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-primary mt-2">{t("app_loading")}</p>
          </div>
        </div>
      )}

      <div className={`${isLoading ? "pointer-events-none" : ""}`}>
        {children}
      </div>
    </div>
  );
};
export default LoaderWrapper;
