/**
 * @file navigationConfig.ts
 * @description Configuración de navegación reutilizable para el Footer
 */

import { Home, Server, Settings, User } from "lucide-react";
import type { Translations } from "../translations/types";

export interface TabItem {
  id: string;
  label: string;
  icon: typeof Home;
  iconProps?: Record<string, unknown>;
}

export const getFooterTabs = (t: Translations): TabItem[] => [
  {
    id: "home",
    label: t.footer.tabs.home,
    icon: Home,
    iconProps: { fill: "currentColor" }, // Para icono filled cuando está activo
  },
  {
    id: "servers",
    label: t.footer.tabs.servers,
    icon: Server,
    iconProps: {},
  },
  {
    id: "profile",
    label: t.footer.tabs.profile,
    icon: User,
    iconProps: {},
  },
  {
    id: "settings",
    label: t.footer.tabs.settings,
    icon: Settings,
    iconProps: {},
  },
];

// Mantener la exportación original para compatibilidad hacia atrás (deprecada)
export const footerTabs: TabItem[] = [
  {
    id: "home",
    label: "HOME",
    icon: Home,
    iconProps: { fill: "currentColor" },
  },
  {
    id: "servers",
    label: "SERVIDORES",
    icon: Server,
    iconProps: {},
  },
  {
    id: "profile",
    label: "PERFIL",
    icon: User,
    iconProps: {},
  },
  {
    id: "settings",
    label: "AJUSTES",
    icon: Settings,
    iconProps: {},
  },
];
