/**
 * @file menuData.tsx
 * @description Configuración de datos para el menú de configuraciones
 */

import {
  Share2,
  RefreshCw,
  LogOut,
  Globe,
  Trash2,
  Wifi,
  Battery,
  Download,
} from "lucide-react";
import { checkBatteryOptimization } from "../../../../utils/appFunctions";
import { openApnSettings } from "../../../../utils/nativeApiFunctions";
import { MenuCategoryProps } from "../types";
import { openExternal } from "./openExternal";
import { Translations } from "../../../../context/LanguageContext";

export const createMenuCategories = (
  onNavigate: (modal: string) => void,
  t: Translations
): MenuCategoryProps[] => [
  {
    title: t.settings.quickActions,
    items: [
      {
        icon: <RefreshCw className="w-5 h-5" />,
        label: t.settings.update,
        description: t.settings.updateDesc,
        onClick: () => {
          try {
            if (window.DtStartAppUpdate?.execute) {
              window.DtStartAppUpdate.execute();
            } else {
              console.warn("DtStartAppUpdate API no disponible");
            }
          } catch (error) {
            console.error("Error al ejecutar actualización:", error);
          }
        },
      },
      {
        icon: <Download className="w-5 h-5" />,
        label: t.settings.downloadApp,
        description: t.settings.downloadAppDesc,
        onClick: () => openExternal("https://play.google.com/store/apps/details?id=com.jjsecure.lite&hl=es_AR"),
      },
    ],
  },
  {
    title: t.settings.tools,
    items: [
      {
        icon: <Share2 className="w-5 h-5" />,
        label: t.settings.hotspot,
        description: t.settings.hotspotDesc,
        onClick: () => onNavigate("hotspot"),
      },
      {
        icon: <Battery className="w-5 h-5" />,
        label: t.settings.battery,
        description: t.settings.batteryDesc,
        onClick: checkBatteryOptimization,
      },
      {
        icon: <Wifi className="w-5 h-5" />,
        label: t.settings.apn,
        description: t.settings.apnDesc,
        onClick: openApnSettings,
      },
    ],
  },
  {
    title: t.settings.configurations,
    items: [
      {
        icon: <LogOut className="w-5 h-5" />,
        label: t.settings.credentials,
        description: t.settings.credentialsDesc,
        onClick: () => onNavigate("credentials"),
      },
      {
        icon: <Trash2 className="w-5 h-5" />,
        label: t.settings.cleanData,
        description: t.settings.cleanDataDesc,
        onClick: () => onNavigate("cleandata"),
      },
    ],
  },
  {
    title: t.settings.support,
    items: [
      {
        icon: <Globe className="w-5 h-5" />,
        label: t.settings.supportCommunitiesLabel || t.settings.support,
        description: t.settings.supportCommunitiesDesc,
        onClick: () => openExternal("https://chat.whatsapp.com/LU16SUptp4xFQ4zTNta7Ja"),
      },
    ],
  },
];
