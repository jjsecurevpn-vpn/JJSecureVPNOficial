/**
 * @file useWindowDimensions.ts
 * @description Hook reutilizable para dimensiones de ventana y cálculos responsivos
 */

import { useState, useEffect, useMemo, useCallback } from 'react';

export interface WindowDimensions {
  width: number;
  height: number;
  isVerySmall: boolean;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  scale: number;
}

interface UseWindowDimensionsOptions {
  /** Ancho base para calcular escala (default: 480) */
  baseWidth?: number;
  /** Alto base para calcular escala (default: 760) */
  baseHeight?: number;
  /** Escala mínima permitida (default: 0.75) */
  minScale?: number;
  /** Debounce en ms para resize (default: 100) */
  debounceMs?: number;
}

const DEFAULT_OPTIONS: Required<UseWindowDimensionsOptions> = {
  baseWidth: 480,
  baseHeight: 760,
  minScale: 0.75,
  debounceMs: 100,
};

/**
 * Hook reutilizable para obtener dimensiones de ventana con cálculos responsivos
 * Incluye debounce automático para evitar renders excesivos durante resize
 */
export function useWindowDimensions(
  options: UseWindowDimensionsOptions = {}
): WindowDimensions {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  const computeDimensions = useCallback((): WindowDimensions => {
    if (typeof window === 'undefined') {
      return {
        width: opts.baseWidth,
        height: opts.baseHeight,
        isVerySmall: false,
        isSmall: false,
        isMedium: true,
        isLarge: false,
        isPortrait: true,
        isLandscape: false,
        scale: 1,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height >= width;
    
    // Breakpoints
    const isVerySmall = height < 640 || width < 360;
    const isSmall = !isVerySmall && height < 740;
    const isLarge = width >= 600;
    const isMedium = !isVerySmall && !isSmall && !isLarge;

    // Cálculo de escala
    const widthScale = width / opts.baseWidth;
    const heightScale = height / opts.baseHeight;
    const rawScale = Math.min(widthScale, heightScale, 1);
    const scale = Math.max(opts.minScale, rawScale);

    return {
      width,
      height,
      isVerySmall,
      isSmall,
      isMedium,
      isLarge,
      isPortrait,
      isLandscape: !isPortrait,
      scale,
    };
  }, [opts.baseWidth, opts.baseHeight, opts.minScale]);

  const [dimensions, setDimensions] = useState<WindowDimensions>(computeDimensions);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: NodeJS.Timeout | null = null;
    let frameId: number | null = null;

    const handleResize = () => {
      // Cancelar timeout anterior
      if (timeoutId) clearTimeout(timeoutId);
      if (frameId) cancelAnimationFrame(frameId);

      // Debounce + requestAnimationFrame para mejor rendimiento
      timeoutId = setTimeout(() => {
        frameId = requestAnimationFrame(() => {
          const newDims = computeDimensions();
          setDimensions(prev => {
            // Solo actualizar si hay cambios significativos
            if (
              prev.width !== newDims.width ||
              prev.height !== newDims.height ||
              prev.scale !== newDims.scale
            ) {
              return newDims;
            }
            return prev;
          });
        });
      }, opts.debounceMs);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [computeDimensions, opts.debounceMs]);

  return dimensions;
}

/**
 * Hook para calcular offset de elevación basado en escala
 */
export function useLiftOffset(scale: number, baseOffset: number = 120): number {
  return useMemo(() => Math.round((1 - scale) * baseOffset), [scale, baseOffset]);
}

/**
 * Hook para obtener clases responsivas comunes
 */
export function useResponsiveClasses(dimensions: WindowDimensions) {
  return useMemo(() => ({
    padding: dimensions.isVerySmall ? 'p-2' : dimensions.isSmall ? 'p-3' : 'p-4',
    gap: dimensions.isVerySmall ? 'gap-2' : dimensions.isSmall ? 'gap-3' : 'gap-4',
    text: dimensions.isVerySmall ? 'text-sm' : dimensions.isSmall ? 'text-base' : 'text-lg',
    rounded: dimensions.isVerySmall ? 'rounded-lg' : 'rounded-xl',
  }), [dimensions.isVerySmall, dimensions.isSmall]);
}
