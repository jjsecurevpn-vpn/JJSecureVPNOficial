import { useState, useEffect } from "react";
import { nativeAPI } from "../utils/unifiedNativeAPI";

export function useAppLayout() {
  const [containerStyle, setContainerStyle] = useState({});
  useEffect(() => {
    const statusBarHeight = nativeAPI.device.getStatusBarHeight();
    const navBarHeight = nativeAPI.device.getNavigationBarHeight();
    setContainerStyle({
      padding: `${statusBarHeight + 8}px 8px ${navBarHeight + 8}px 8px`,
    });
  }, []);
  return { containerStyle };
}
