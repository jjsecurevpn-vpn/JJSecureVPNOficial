/**
 * @file useResponsive.ts (ADAPTADOR)
 * Este archivo ahora es un wrapper simplificado hacia el sistema unificado.
 * Reemplaza la implementación previa. Puedes eliminarlo tras actualizar imports.
 */
import { useResponsiveUI, BREAKPOINTS } from '../responsive/unifiedResponsive';

export type Breakpoint = import('../responsive/unifiedResponsive').BreakpointKey;

export interface ResponsiveState {
  width: number;
  height: number;
  breakpoint: Breakpoint;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isXSmall: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  isTouchDevice: boolean;
}

export function useResponsive(): ResponsiveState {
  const { width, height, bp, isPortrait, isLandscape, isTouch, flags } = useResponsiveUI();
  return {
    width,
    height,
    breakpoint: bp,
    isSmall: flags.ltMd || flags.md,
    isMedium: bp === 'md',
    isLarge: flags.gteLg,
    isXSmall: bp === 'xs',
    isPortrait,
    isLandscape,
    isTouchDevice: isTouch,
  };
}

// Export de map de breakpoints para compatibilidad (si alguien lo usa)
export const breakpoints = BREAKPOINTS;


