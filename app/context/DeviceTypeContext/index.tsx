import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MOBILE_BREAKPOINT } from "~/constants/constants";

export interface DeviceTypeContextState {
  isDesktopView: boolean;
}

export const DeviceTypeContext = createContext<DeviceTypeContextState>({
  isDesktopView: true,
});

const DeviceTypeProvider = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState(true);
  const onResize = useCallback((e: MediaQueryListEvent) => {
    setIsDesktopView(e.matches);
  }, []);
  useEffect(() => {
    const mediaWatcher = window.matchMedia(
      `(min-width: ${MOBILE_BREAKPOINT}px)`,
    );
    setIsDesktopView(mediaWatcher.matches);
    mediaWatcher.addEventListener("change", onResize);
  }, [onResize]);

  const deviceTypeValue = useMemo<DeviceTypeContextState>(
    () => ({
      isDesktopView,
    }),
    [isDesktopView],
  );

  return (
    <DeviceTypeContext.Provider value={deviceTypeValue}>
      {children}
    </DeviceTypeContext.Provider>
  );
};

export default DeviceTypeProvider;
