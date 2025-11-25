/**
 * @file headerUtils.ts
 * @description Utilidades para el componente Header con sistema responsivo
 */

import { responsiveSpacing } from '../constants/responsiveLayout';
import type { Breakpoint } from '../hooks/useResponsive';
import type { Translations } from '../context/LanguageContext';

// Función para determinar la IP a mostrar según el estado
export const getDisplayIP = (
  isConnected: boolean,
  vpnIP?: string | null,
  geoIP?: string,
  localIP?: string | null,
  fallbackIP?: string,
  t?: Translations
): string => {
  if (isConnected) {
    return vpnIP || geoIP || fallbackIP || (t?.header.connecting || 'Conectando...');
  }
  return localIP || fallbackIP || (t?.header.noConnection || 'Sin conexión');
};

// Función para obtener el estado de protección
export const getProtectionStatus = (isConnected: boolean, t?: Translations) => ({
  text: isConnected ? (t?.header.protected || "Estoy protegido") : (t?.header.notProtected || "No está protegido"),
  iconColor: isConnected ? "text-emerald-400" : "text-rose-400",
  ariaLabel: isConnected ? "Conectado" : "Desconectado"
});

// Función para determinar la IP objetivo para geolocalización
export const getTargetIPForGeo = (
  isConnected: boolean, 
  vpnIP?: string | null
): string | undefined => {
  return isConnected && vpnIP ? vpnIP : undefined;
};

// Función para obtener estilos responsivos del overlay
export const getResponsiveOverlayStyles = (breakpoint: Breakpoint) => {
  const topPositions = {
    xs: '64px',
    sm: '70px',
    md: '76px',
    lg: '84px',
    xl: '84px'
  };
  
  return {
    position: 'fixed' as const,
    left: '50%',
    transform: 'translateX(-50%)',
    top: topPositions[breakpoint],
    zIndex: 4,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: responsiveSpacing.element[breakpoint],
    userSelect: 'text' as const,
  };
};

// Estilos del header usando clases Tailwind (mantiene compatibilidad)
export const HEADER_STYLES = {
  container: "flex flex-col items-center justify-center bg-transparent relative z-[3] scrollbar-hidden",
} as const;

// Constantes de estilos base para componentes UI
export const HEADER_UI_STYLES = {
  overlay: "z-[4] flex flex-col items-center select-text",
  ipContainer: "flex flex-col items-center",
  ipBadge: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-white/90",
  separator: "text-white/30"
} as const;

// (Deprecated) getResponsiveTextStyles eliminado: ahora usamos clases Tailwind utilitarias

// Función para obtener alturas mínimas responsivas
export const getResponsiveMinHeight = (breakpoint: Breakpoint) => {
  const heights = {
    xs: '48px',
    sm: '52px', 
    md: '56px',
    lg: '60px',
    xl: '64px'
  };
  
  return heights[breakpoint];
};
