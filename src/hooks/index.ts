/**
 * @file hooks/index.ts
 * @description Barrel exports para todos los hooks - Importaciones limpias
 * 
 * Uso:
 * import { useUnifiedVpn, useIPInfo, usePolling } from '@/hooks';
 */

// ===== HOOKS DE VPN Y CONEXIÓN =====
export { useUnifiedVpn, type UnifiedVpnState, type UseUnifiedVpnOptions } from './useUnifiedVpn';
export { useIPInfo, type UseIPInfoResult } from './useIPInfo';
export { useGeoLocation } from './useGeoLocation';
export { useHotspot, type HotspotState, type UseHotspotReturn } from './useHotspot';
export { useHotspotEvents, useHotspotActive, type HotspotEventState, type HotspotStateValue } from './useHotspotEvents';

// ===== HOOKS DE RED Y ESTADÍSTICAS =====
export { useNetSpeeds, type NetSpeedsResult, type UseNetSpeedsOptions } from './useNetSpeeds';

// ===== HOOKS DE USUARIO Y EVENTOS =====
export { useUserEvents, useConfigEvents, type UserEventState, type ConfigEventState } from './useUserEvents';

// ===== HOOKS DE NAVEGACIÓN =====
export { useAppNavigation, type NavigationState, type NavigationActions } from './useAppNavigation';
export { useAndroidBackButton, registerAndroidBackHandler } from './useAndroidBackButton';

// ===== HOOKS DE LAYOUT Y RESPONSIVO =====
export { useAppLayout } from './useAppLayout';
export { useResponsive, type ResponsiveState, type Breakpoint, breakpoints } from './useResponsive';
export { 
  useResponsiveScale, 
  useResponsiveText, 
  useResponsiveIcon, 
  useResponsiveButton, 
  useResponsiveSpacing,
  useResponsiveValue,
  useResponsiveStyles,
  useMultiScaleResponsive,
  type ScaleType,
  type ResponsiveScaleConfig
} from './useResponsiveScale';
export { 
  useWindowDimensions, 
  useLiftOffset, 
  useResponsiveClasses,
  type WindowDimensions
} from './useWindowDimensions';

// ===== HOOKS DE TRADUCCIONES =====
export { useTranslations } from './useTranslations';

// ===== HOOKS DE UTILIDAD =====
export { useAutoTutorial } from './useAutoTutorial';
export { usePolling, useAdaptivePolling, type UsePollingOptions } from './usePolling';
