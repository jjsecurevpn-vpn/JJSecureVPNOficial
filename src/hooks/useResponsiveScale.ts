/**
 * @file useResponsiveScale.ts (ADAPTADOR)
 * Reemplaza la implementación anterior. Migra a useResponsiveUI() directamente.
 */
import { useMemo } from 'react';
import { useResponsiveUI, useResponsiveValue as useUnifiedResponsiveValue } from '../responsive/unifiedResponsive';

export type ScaleType = import('../responsive/unifiedResponsive').ScaleCategory;

export interface ResponsiveScaleConfig {
  type?: ScaleType;
  baseValues?: Record<string, string | number>;
  baseDimensions?: { width?: number; height?: number; maxWidth?: number; maxHeight?: number };
}

export function useResponsiveScale(config: ResponsiveScaleConfig = {}) {
  const { scale, scaleStyles, bp, tokens } = useResponsiveUI();
  const { type = 'component', baseValues, baseDimensions } = config;

  const scaleFactor = scale(type, 1);

  const scaledStyles = useMemo(() => baseValues ? scaleStyles(baseValues, type) : {}, [baseValues, type, scaleStyles, bp]);

  const scaledDimensions = useMemo(() => {
    if (!baseDimensions) return {};
    const out: Record<string, string | number> = {};
    Object.entries(baseDimensions).forEach(([k,v]) => {
      if (typeof v === 'number') out[k] = scale(type === 'component' ? 'component' : type, v) + 'px';
    });
    return out;
  }, [baseDimensions, type, scale, bp]);

  return {
    scaleFactor,
    scaledStyles,
    scaledDimensions,
    scale: (value: number) => scale(type, value),
    scaleCSS: (value: string) => {
      const m = value.match(/^(\d*\.?\d+)(px|rem|em|%)$/);
      if (!m) return value;
      return `${scale(type, parseFloat(m[1]))}${m[2]}`;
    },
    spacing: (value: number | string) => {
      if (typeof value === 'string') {
        const m = value.match(/^(\d*\.?\d+)(px)$/); if (!m) return value;
        return `${scale('spacing', parseFloat(m[1]))}px`;
      }
      return `${scale('spacing', value)}px`;
    },
    fontSize: (value: number | string) => {
      if (typeof value === 'string') {
        const m = value.match(/^(\d*\.?\d+)(px)$/); if (!m) return value;
        return `${scale('text', parseFloat(m[1]))}px`;
      }
      return `${scale('text', value)}px`;
    },
    tokens,
  };
}

export function useResponsiveText() { return useResponsiveScale({ type: 'text' }); }
export function useResponsiveIcon() { return useResponsiveScale({ type: 'icon' }); }
export function useResponsiveButton() { return useResponsiveScale({ type: 'button' }); }
export function useResponsiveSpacing() {
  const { scale } = useResponsiveUI();
  return {
    spacing: (v: number | string) => typeof v === 'number' ? `${scale('spacing', v)}px` : v,
    padding: (v: number | string) => typeof v === 'number' ? `${scale('spacing', v)}px` : v,
    margin: (v: number | string) => typeof v === 'number' ? `${scale('spacing', v)}px` : v,
  };
}

export function useResponsiveValue<T>(values: Partial<Record<import('../responsive/unifiedResponsive').BreakpointKey, T>> | T, fallback?: T): T {
  return useUnifiedResponsiveValue(values as any, fallback);
}

export function useResponsiveStyles<T extends Record<string, any>>(baseStyles: T, scaleType: ScaleType = 'component'): T {
  const { scaleStyles, bp } = useResponsiveUI();
  return useMemo(() => scaleStyles(baseStyles, scaleType), [baseStyles, scaleType, bp, scaleStyles]);
}

export function useMultiScaleResponsive() {
  const { scale } = useResponsiveUI();
  return useMemo(() => ({
    text: { scale: (v: number) => scale('text', v), fontSize: (v: number | string) => typeof v === 'number' ? `${scale('text', v)}px` : v },
    icon: { scale: (v: number) => scale('icon', v), size: (v: number) => `${scale('icon', v)}px` },
    button: { scale: (v: number) => scale('button', v), padding: (v: number | string) => typeof v === 'number' ? `${scale('spacing', v)}px` : v },
    spacing: { scale: (v: number) => scale('spacing', v), value: (v: number | string) => typeof v === 'number' ? `${scale('spacing', v)}px` : v },
    component: { scale: (v: number) => scale('component', v), styles: (styles: Record<string, string | number>) => styles },
  }), [scale]);
}
