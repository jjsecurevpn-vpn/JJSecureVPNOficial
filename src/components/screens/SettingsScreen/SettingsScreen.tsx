/**
 * @file SettingsScreen.tsx
 * @description Pantalla de configuraciones refactorizada con ScreenLayout
 */

import React from "react";
import { ScreenLayout } from "../../layouts";
import { useTranslations } from "../../../context/LanguageContext";

import { AccountSection } from "./components/AccountSection";
import { MenuSection } from "./components/MenuSection";
import { FooterSection } from "./components/FooterSection";

import { useSettingsScreen } from "./hooks/useSettingsScreen";
import { createMenuCategories } from "./utils/menuData";

interface SettingsScreenFixedProps {
  onNavigate: (modal: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenFixedProps> = ({ onNavigate }) => {
  const t = useTranslations();
  
  const {
    navigationBarHeight,
  } = useSettingsScreen();

  const menuCategories = createMenuCategories(onNavigate, t);

  return (
    <ScreenLayout
      title={t.settings.title}
      enableScrollEffect={true}
      horizontalPadding={24}
      verticalPadding={16}
    >
  <div className="mx-auto w-full max-w-5xl space-y-8 px-2 sm:px-0">
        <AccountSection />

        <MenuSection categories={menuCategories} />

        <FooterSection navigationBarHeight={navigationBarHeight} />
      </div>
    </ScreenLayout>
  );
};