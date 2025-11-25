/**
 * @file responsiveLayout.ts
 * @description Constantes y utilities para layout responsivo
 */

import { spacing } from './theme';
import type { Breakpoint } from '../hooks/useResponsive';

// Espaciado responsivo
export const responsiveSpacing = {
  container: {
    xs: spacing.sm,     // 8px
    sm: spacing.md,     // 12px
    md: spacing.lg,     // 16px
    lg: spacing.xl,     // 20px
    xl: spacing['2xl'], // 24px
  },
  section: {
    xs: spacing.lg,     // 16px
    sm: spacing.xl,     // 20px
    md: spacing['2xl'], // 24px
    lg: spacing['3xl'], // 32px
    xl: spacing['4xl'], // 40px
  },
  element: {
    xs: spacing.xs,     // 4px
    sm: spacing.sm,     // 8px
    md: spacing.md,     // 12px
    lg: spacing.lg,     // 16px
    xl: spacing.xl,     // 20px
  }
} as const;

// Tamaños de fuente responsivos
export const responsiveFontSizes = {
  h1: {
    xs: '24px',
    sm: '28px',
    md: '28px',
    lg: '32px',
    xl: '32px',
  },
  h2: {
    xs: '20px',
    sm: '24px',
    md: '24px',
    lg: '28px',
    xl: '28px',
  },
  h3: {
    xs: '18px',
    sm: '20px',
    md: '20px',
    lg: '24px',
    xl: '24px',
  },
  body: {
    xs: '14px',
    sm: '15px',
    md: '15px',
    lg: '16px',
    xl: '16px',
  },
  caption: {
    xs: '11px',
    sm: '12px',
    md: '12px',
    lg: '12px',
    xl: '12px',
  }
} as const;

// Alturas mínimas responsivas para componentes
export const responsiveHeights = {
  button: {
    xs: '40px',
    sm: '44px',
    md: '48px',
    lg: '48px',
    xl: '56px',
  },
  input: {
    xs: '36px',
    sm: '40px',
    md: '44px',
    lg: '48px',
    xl: '48px',
  },
  card: {
    minHeight: {
      xs: 'auto',
      sm: 'auto',
      md: 'auto',
      lg: 'auto',
      xl: 'auto',
    }
  }
} as const;

// Función helper para obtener valor responsivo
export function getResponsiveValue<T>(
  values: Partial<Record<Breakpoint, T>>,
  currentBreakpoint: Breakpoint
): T | undefined {
  // Buscar el valor más específico disponible
  const orderedBreakpoints: Breakpoint[] = ['xl', 'lg', 'md', 'sm', 'xs'];
  const currentIndex = orderedBreakpoints.indexOf(currentBreakpoint);
  
  for (let i = currentIndex; i < orderedBreakpoints.length; i++) {
    const bp = orderedBreakpoints[i];
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }
  
  return undefined;
}

// Función para obtener estilos de container responsivo
export function getResponsiveContainerStyles(breakpoint: Breakpoint) {
  return {
    padding: getResponsiveValue(responsiveSpacing.container, breakpoint),
    gap: getResponsiveValue(responsiveSpacing.element, breakpoint),
  };
}

// Función para obtener estilos de sección responsivo
export function getResponsiveSectionStyles(breakpoint: Breakpoint) {
  return {
    marginBottom: getResponsiveValue(responsiveSpacing.section, breakpoint),
    gap: getResponsiveValue(responsiveSpacing.element, breakpoint),
  };
}

// Constantes para overflow y scroll
export const scrollStyles = {
  container: {
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
    maxHeight: '100%',
    // Scroll suave
    scrollBehavior: 'smooth' as const,
    // Webkit scrollbar styling
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '2px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(255, 255, 255, 0.3)',
      borderRadius: '2px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: 'rgba(255, 255, 255, 0.4)',
    },
  },
  modal: {
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
  }
} as const;
