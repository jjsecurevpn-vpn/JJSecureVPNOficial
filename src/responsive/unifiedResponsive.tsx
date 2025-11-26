import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * @file unifiedResponsive.tsx
 * @description Sistema responsivo unificado para JJSecure.
 * Simplifica y reemplaza: useResponsive, useResponsiveScale, responsiveScale.ts y responsiveLayout.ts
 * Objetivos:
 *  - Un solo origen de verdad para breakpoints y escalado
 *  - API mínima y expresiva
 *  - Reducir archivos y duplicación
 *  - Facilitar ajustes futuros (solo editar TOKENS o FACTORES)
 */

/* =============================
 *  BREAKPOINTS
 * ============================= */
export const BREAKPOINTS = {
  xs: 280,
  sm: 360,
  md: 450,
  lg: 500,
  xl: 600,
} as const;
export type BreakpointKey = keyof typeof BREAKPOINTS;

/* =============================
 *  FACTORES DE ESCALADO (por tipo)
 * ============================= */
const SCALE_MAP: Record<string, Record<BreakpointKey, number>> = {
  text:   { xs: 0.8,  sm: 0.9,  md: 1.0, lg: 1.05, xl: 1.1 },
  icon:   { xs: 0.75, sm: 0.85, md: 1.0, lg: 1.15, xl: 1.25 },
  button: { xs: 0.85, sm: 0.92, md: 1.0, lg: 1.08, xl: 1.15 },
  spacing:{ xs: 0.7,  sm: 0.8,  md: 1.0, lg: 1.2,  xl: 1.4 },
  component:{ xs: 0.8, sm: 0.9,  md: 1.0, lg: 1.1,  xl: 1.2 },
};
export type ScaleCategory = keyof typeof SCALE_MAP;

/* =============================
 *  TOKENS BASE (puedes ajustar aquí y todo reacciona)
 * ============================= */
const BASE_TOKENS = {
  spacing: {
    unit: 4, // px
    container: { xs: 8,  sm: 12, md: 16, lg: 20, xl: 24 },
    section:   { xs: 16, sm: 20, md: 24, lg: 32, xl: 40 },
    element:   { xs: 4,  sm: 8,  md: 12, lg: 16, xl: 20 },
  },
  font: {
    h1: { xs: 24, sm: 28, md: 28, lg: 32, xl: 32 },
    h2: { xs: 20, sm: 24, md: 24, lg: 28, xl: 28 },
    h3: { xs: 18, sm: 20, md: 20, lg: 24, xl: 24 },
    body:{ xs: 14, sm: 15, md: 15, lg: 16, xl: 16 },
    caption:{ xs: 11, sm: 12, md: 12, lg: 12, xl: 12 },
  },
  height: {
    button: { xs: 40, sm: 44, md: 48, lg: 48, xl: 56 },
    input:  { xs: 36, sm: 40, md: 44, lg: 48, xl: 48 },
  }
};

/* =============================
 *  HELPERS INTERNOS
 * ============================= */
function detectBreakpoint(width: number): BreakpointKey {
  if (width <= BREAKPOINTS.xs) return 'xs';
  if (width <= BREAKPOINTS.sm) return 'sm';
  if (width <= BREAKPOINTS.md) return 'md';
  if (width <= BREAKPOINTS.lg) return 'lg';
  return 'xl';
}

function scaleNumber (value: number, category: ScaleCategory, bp: BreakpointKey) {
  return +(value * SCALE_MAP[category][bp]).toFixed(2);
}

function applyScaleToStyles<T extends Record<string, unknown>>(styles: T, category: ScaleCategory, bp: BreakpointKey): T {
  const out: Record<string, unknown> = {};
  Object.entries(styles).forEach(([k,v]) => {
    if (typeof v === 'number') {
      out[k] = scaleNumber(v, category, bp);
    } else if (typeof v === 'string') {
      const m = v.match(/^(\d*\.?\d+)(px|rem|em|%)$/);
      if (m) {
        out[k] = `${scaleNumber(parseFloat(m[1]), category, bp)}${m[2]}`;
      } else {
        out[k] = v;
      }
    } else {
      out[k] = v;
    }
  });
  return out as T;
}

function pickResponsiveValue<T>(values: Partial<Record<BreakpointKey, T>>, bp: BreakpointKey, fallback?: T): T | undefined {
  if (values[bp] !== undefined) return values[bp];
  const order: BreakpointKey[] = ['md','lg','sm','xl','xs'];
  for (const key of order) {
    if (values[key] !== undefined) return values[key];
  }
  return fallback;
}

/* =============================
 *  TIPOS DEL CONTEXTO
 * ============================= */
interface UnifiedResponsiveContext {
  width: number;
  height: number;
  bp: BreakpointKey;
  isPortrait: boolean;
  isLandscape: boolean;
  isTouch: boolean;
  flags: {
    xs: boolean; sm: boolean; md: boolean; lg: boolean; xl: boolean;
    ltMd: boolean; gteMd: boolean; gteLg: boolean;
  };
  // Escalado
  scale: (category: ScaleCategory, value: number) => number;
  scaleStyles: <T extends Record<string, unknown>>(styles: T, category?: ScaleCategory) => T;
  // Tokens procesados
  tokens: {
    font: Record<keyof typeof BASE_TOKENS.font, number>;
    spacing: { unit: number; container: number; section: number; element: number };
    height: Record<keyof typeof BASE_TOKENS.height, number>;
  };
  // Helpers de acceso a valores responsivos
  value: <T>(map: Partial<Record<BreakpointKey, T>> | T, fallback?: T) => T;
  spacePx: (multiplier: number) => number; // unit * multiplier escalado spacing
  fontPx: (token: keyof typeof BASE_TOKENS.font) => number; // font-size en px
}

const ResponsiveCtx = createContext<UnifiedResponsiveContext | null>(null);

/* =============================
 *  PROVIDER
 * ============================= */
export const UnifiedResponsiveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getSnapshot = () => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 360;
    const h = typeof window !== 'undefined' ? window.innerHeight : 640;
    const bp = detectBreakpoint(w);
    return { w, h, bp };
  };

  const [{ w, h, bp }, setDims] = useState(getSnapshot);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let frame: number | null = null;
    const handle = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const snap = getSnapshot();
        setDims(prev => (prev.w === snap.w && prev.h === snap.h && prev.bp === snap.bp) ? prev : snap);
      });
    };
    window.addEventListener('resize', handle);
    window.addEventListener('orientationchange', handle);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('resize', handle);
      window.removeEventListener('orientationchange', handle);
    };
  }, []);

  const isTouch = useMemo(() => typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0), [w]);
  const isPortrait = h >= w;
  const isLandscape = !isPortrait;

  const flags = useMemo(() => ({
    xs: bp === 'xs',
    sm: bp === 'sm',
    md: bp === 'md',
    lg: bp === 'lg',
    xl: bp === 'xl',
    ltMd: bp === 'xs' || bp === 'sm',
    gteMd: bp === 'md' || bp === 'lg' || bp === 'xl',
    gteLg: bp === 'lg' || bp === 'xl',
  }), [bp]);

  // Tokens ya resueltos para el breakpoint actual
  const tokens = useMemo(() => {
    const font: Record<string, number> = {};
    Object.entries(BASE_TOKENS.font).forEach(([k, map]) => { font[k] = (map as Record<BreakpointKey, number>)[bp]; });
    const spacing = {
      unit: BASE_TOKENS.spacing.unit,
      container: (BASE_TOKENS.spacing.container as Record<BreakpointKey, number>)[bp],
      section: (BASE_TOKENS.spacing.section as Record<BreakpointKey, number>)[bp],
      element: (BASE_TOKENS.spacing.element as Record<BreakpointKey, number>)[bp],
    };
    const height: Record<string, number> = {};
    Object.entries(BASE_TOKENS.height).forEach(([k, map]) => { height[k] = (map as Record<BreakpointKey, number>)[bp]; });
    return { font: font as Record<keyof typeof BASE_TOKENS.font, number>, spacing, height: height as Record<keyof typeof BASE_TOKENS.height, number> };
  }, [bp]);

  const ctx: UnifiedResponsiveContext = useMemo(() => ({
    width: w,
    height: h,
    bp,
    isPortrait,
    isLandscape,
    isTouch,
    flags,
    scale: (category, value) => scaleNumber(value, category, bp),
    scaleStyles: (styles, category = 'component') => applyScaleToStyles(styles, category, bp),
    tokens,
    value: <T,>(map: Partial<Record<BreakpointKey, T>> | T, fallback?: T): T => {
      if (typeof map !== 'object' || map === null) return map as T;
      return (pickResponsiveValue(map as Partial<Record<BreakpointKey, T>>, bp, fallback) ?? fallback) as T;
    },
    spacePx: (mult = 1) => scaleNumber(BASE_TOKENS.spacing.unit * mult, 'spacing', bp),
    fontPx: (token) => tokens.font[token],
  }), [w, h, bp, isPortrait, isLandscape, isTouch, flags, tokens]) as UnifiedResponsiveContext;

  return <ResponsiveCtx.Provider value={ctx}>{children}</ResponsiveCtx.Provider>;
};

/* =============================
 *  HOOK PRINCIPAL
 * ============================= */
export function useResponsiveUI() {
  const ctx = useContext(ResponsiveCtx);
  if (!ctx) {
    throw new Error('useResponsiveUI debe usarse dentro de <UnifiedResponsiveProvider>');
  }
  return ctx;
}

/* =============================
 *  SHORTCUTS / APIS DERIVADAS
 * ============================= */
export function useBreakpoint() { return useResponsiveUI().bp; }
export function useScaledNumber(category: ScaleCategory, value: number) { return useResponsiveUI().scale(category, value); }
export function useResponsiveValue<T>(map: Partial<Record<BreakpointKey, T>> | T, fallback?: T) { return useResponsiveUI().value(map, fallback) as T; }

/* =============================
 *  COMPONENTE OPCIONAL: Wrapper root
 * ============================= */
export const WithResponsive: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <UnifiedResponsiveProvider>{children}</UnifiedResponsiveProvider>
);

/* =============================
 *  NOTAS DE MIGRACIÓN (puedes borrar luego)
 *  - Reemplazar import { useResponsive } por import { useResponsiveUI }
 *  - Reemplazar useResponsiveScale(...) por directamente:
 *      const { scale, scaleStyles, tokens, spacePx, fontPx } = useResponsiveUI();
 *  - Para valores responsivos antes con useResponsiveValue -> useResponsiveValue exportado aquí.
 */
