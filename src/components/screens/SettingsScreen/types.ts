/**
 * @file types.ts
 * @description Tipos para SettingsScreen y sus componentes
 */

import { ReactNode } from "react";

export interface SettingsScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (modal: string) => void;
}

export interface MenuItemProps {
  icon: ReactNode;
  label: string;
  description?: string;
  onClick: () => void;
}

export interface MenuCategoryProps {
  title: string;
  items: MenuItemProps[];
}

export interface AccountSectionProps {
  onOpenPremiumInfo?: () => void;
}

export interface MenuSectionProps {
  categories: MenuCategoryProps[];
}

export interface FooterSectionProps {
  navigationBarHeight: number;
}

export interface SettingsHeaderProps {
  isScrolled: boolean;
  statusBarHeight: number;
}
