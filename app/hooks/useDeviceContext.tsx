import { useContext } from "react";
import { DeviceTypeContext } from "~/context/DeviceTypeContext";

const useDeviceContext = () => {
  const { isDesktopView } = useContext(DeviceTypeContext);
  return { isDesktopView };
};

export default useDeviceContext;
