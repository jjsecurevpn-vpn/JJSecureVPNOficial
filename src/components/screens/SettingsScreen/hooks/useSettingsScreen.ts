/**
 * @file useSettingsScreen.ts
 * @description Hook principal para la lógica de SettingsScreen
 */

import { useEffect, useState } from "react";
import { getStatusBarHeight, getNavigationBarHeight } from "../../../../utils/deviceUtils";
import { SETTINGS_SCROLL_THRESHOLD } from "../utils/openExternal";

export const useSettingsScreen = () => {
  const [statusBarHeight, setStatusBarHeight] = useState(0);
  const [navigationBarHeight, setNavigationBarHeight] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPremiumInfoOpen, setIsPremiumInfoOpen] = useState(false);

  useEffect(() => {
    const updateSafeAreas = () => {
      setStatusBarHeight(getStatusBarHeight());
      setNavigationBarHeight(getNavigationBarHeight());
    };

    updateSafeAreas();
    window.addEventListener("resize", updateSafeAreas);
    return () => window.removeEventListener("resize", updateSafeAreas);
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    setIsScrolled((e.currentTarget as HTMLElement).scrollTop > SETTINGS_SCROLL_THRESHOLD);
  };

  const openPremiumInfo = () => setIsPremiumInfoOpen(true);
  const closePremiumInfo = () => setIsPremiumInfoOpen(false);

  return {
    statusBarHeight,
    navigationBarHeight,
    isScrolled,
    isPremiumInfoOpen,
    handleScroll,
    openPremiumInfo,
    closePremiumInfo,
  };
};
