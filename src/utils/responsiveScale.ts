/**
 * @file responsiveScale.ts
 * @description Sistema de escalado responsivo que ajusta elementos basado en el tamaño de pantalla
 */

import type { Breakpoint } from '../hooks/useResponsive';

// Factores de escalado para cada breakpoint
export const scaleFactors = {
  xs: 0.75,   // 75% del tamaño base para pantallas muy pequeñas
  sm: 0.85,   // 85% del tamaño base para pantallas pequeñas
  md: 1.0,    // 100% del tamaño base (referencia)
  lg: 1.1,    // 110% del tamaño base para pantallas grandes
  xl: 1.2,    // 120% del tamaño base para pantallas extra grandes
} as const;

// Configuración de escalado por tipo de elemento
export const elementScaling = {
  // Escalado para texto
  text: {
    xs: 0.8,
    sm: 0.9,
    md: 1.0,
    lg: 1.05,
    xl: 1.1,
  },
  // Escalado para iconos
  icon: {
    xs: 0.75,
    sm: 0.85,
    md: 1.0,
    lg: 1.15,
    xl: 1.25,
  },
  // Escalado para botones
  button: {
    xs: 0.85,
    sm: 0.92,
    md: 1.0,
    lg: 1.08,
    xl: 1.15,
  },
  // Escalado para espaciado
  spacing: {
    xs: 0.7,
    sm: 0.8,
    md: 1.0,
    lg: 1.2,
    xl: 1.4,
  },
  // Escalado para componentes de UI
  component: {
    xs: 0.8,
    sm: 0.9,
    md: 1.0,
    lg: 1.1,
    xl: 1.2,
  }
} as const;

export type ScaleType = keyof typeof elementScaling;

/**
 * Obtiene el factor de escalado para un tipo de elemento y breakpoint
 */
export function getScaleFactor(
  type: ScaleType,
  breakpoint: Breakpoint
): number {
  return elementScaling[type][breakpoint];
}

/**
 * Escala un valor numérico basado en el breakpoint y tipo de elemento
 */
export function scaleValue(
  value: number,
  type: ScaleType,
  breakpoint: Breakpoint
): number {
  const factor = getScaleFactor(type, breakpoint);
  return Math.round(value * factor * 100) / 100; // Redondear a 2 decimales
}

/**
 * Escala un valor CSS (con unidades) basado en el breakpoint y tipo de elemento
 */
export function scaleCSSValue(
  value: string,
  type: ScaleType,
  breakpoint: Breakpoint
): string {
  // Extraer número y unidad del valor CSS
  const match = value.match(/^(\d*\.?\d+)(.*)$/);
  if (!match) return value;
  
  const [, numberStr, unit] = match;
  const number = parseFloat(numberStr);
  const scaledValue = scaleValue(number, type, breakpoint);
  
  return `${scaledValue}${unit}`;
}

/**
 * Aplica escalado a múltiples propiedades CSS
 */
export function scaleStyles(
  styles: Record<string, string | number>,
  type: ScaleType,
  breakpoint: Breakpoint
): Record<string, string | number> {
  const scaledStyles: Record<string, string | number> = {};
  
  for (const [property, value] of Object.entries(styles)) {
    if (typeof value === 'number') {
      scaledStyles[property] = scaleValue(value, type, breakpoint);
    } else if (typeof value === 'string' && /^\d*\.?\d+/.test(value)) {
      scaledStyles[property] = scaleCSSValue(value, type, breakpoint);
    } else {
      scaledStyles[property] = value;
    }
  }
  
  return scaledStyles;
}

/**
 * Crea un objeto de estilos responsivos basado en valores por breakpoint
 */
export function createResponsiveStyles<T>(
  values: Partial<Record<Breakpoint, T>>,
  type: ScaleType = 'component'
): Partial<Record<Breakpoint, T>> {
  const responsiveStyles: Partial<Record<Breakpoint, T>> = {};
  
  // Si no hay valor base, usar 'md' como referencia
  const baseValue = values.md || values.lg || values.sm;
  if (!baseValue) return values;
  
  // Generar valores escalados para cada breakpoint
  Object.keys(elementScaling[type]).forEach((bp) => {
    const breakpoint = bp as Breakpoint;
    if (values[breakpoint]) {
      responsiveStyles[breakpoint] = values[breakpoint];
    } else if (typeof baseValue === 'object' && baseValue !== null) {
      // Para objetos de estilos
      responsiveStyles[breakpoint] = scaleStyles(
        baseValue as Record<string, string | number>,
        type,
        breakpoint
      ) as T;
    }
  });
  
  return responsiveStyles;
}

/**
 * Calcula dimensiones responsivas para contenedores
 */
export function getResponsiveDimensions(
  baseDimensions: { width?: number; height?: number; maxWidth?: number; maxHeight?: number },
  breakpoint: Breakpoint,
  type: ScaleType = 'component'
): Record<string, string | number> {
  const dimensions: Record<string, string | number> = {};
  
  if (baseDimensions.width !== undefined) {
    dimensions.width = `${scaleValue(baseDimensions.width, type, breakpoint)}px`;
  }
  
  if (baseDimensions.height !== undefined) {
    dimensions.height = `${scaleValue(baseDimensions.height, type, breakpoint)}px`;
  }
  
  if (baseDimensions.maxWidth !== undefined) {
    dimensions.maxWidth = `${scaleValue(baseDimensions.maxWidth, type, breakpoint)}px`;
  }
  
  if (baseDimensions.maxHeight !== undefined) {
    dimensions.maxHeight = `${scaleValue(baseDimensions.maxHeight, type, breakpoint)}px`;
  }
  
  return dimensions;
}

/**
 * Genera padding/margin responsivo
 */
export function getResponsiveSpacing(
  baseSpacing: number | string,
  breakpoint: Breakpoint
): string {
  if (typeof baseSpacing === 'string') {
    return scaleCSSValue(baseSpacing, 'spacing', breakpoint);
  }
  
  return `${scaleValue(baseSpacing, 'spacing', breakpoint)}px`;
}

/**
 * Genera font-size responsivo
 */
export function getResponsiveFontSize(
  baseFontSize: number | string,
  breakpoint: Breakpoint
): string {
  if (typeof baseFontSize === 'string') {
    return scaleCSSValue(baseFontSize, 'text', breakpoint);
  }
  
  return `${scaleValue(baseFontSize, 'text', breakpoint)}px`;
}
