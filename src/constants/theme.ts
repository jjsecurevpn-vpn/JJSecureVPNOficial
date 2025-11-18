/**
 * @file theme.ts
 * @description Constantes de tema y colores para mantener consistencia en toda la aplicación
 */

export const colors = {
  // Colores principales
  background: {
    primary: '#1a1a24',
    secondary: '#23232f',
    tertiary: '#2d2d3a',
  },
  
  // Colores de texto
  text: {
    primary: '#ffffff',
    secondary: '#e6e6eb',
    tertiary: '#b3b3ba',
    disabled: '#7a7a85',
  },
  
  // Colores de marca
  brand: {
    primary: '#6d4aff',
    strong: '#4c1d95',
    soft: '#b49dff',
  },
  
  // Colores de acento
  accent: {
    primary: '#00b96b',
    strong: '#008f51',
    soft: '#6fe1b3',
  },
  
  // Colores de estado
  status: {
    success: '#00b96b',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#6d4aff',
  },
  
  // Colores de borde
  border: {
    primary: '#2a2a35',
    secondary: '#3a3a46',
  },
  
  // Efectos y overlays
  overlay: {
    backdrop: 'rgba(0,0,0,0.6)',
    backdropHover: 'rgba(0,0,0,0.8)',
  },

  // Estados interactivos - helpers para hover, focus, active, disabled
  states: {
    hover: {
      // Para fondos: elevar brillo 4-8%
      backgroundLift: 'brightness(1.06)',
      // Para botones primarios
      primaryHover: '#008f51',
      // Para superficies
      surfaceHover: '#2d2d3a',
    },
    focus: {
      outline: '2px solid',
      outlineColor: '#6d4aff',
      outlineOffset: '2px',
    },
    active: {
      // Reducir brillo 6-10%
      brightness: 'brightness(0.94)',
    },
    disabled: {
      opacity: 0.45,
      cursor: 'not-allowed',
    }
  }
} as const;

export const shadows = {
  // Sombras según tu especificación
  level1: '0 1px 2px rgba(0,0,0,0.35)',
  level2: '0 4px 12px rgba(0,0,0,0.35)',
  card: '0 1px 2px rgba(0,0,0,0.35)',
  
  // Focus rings
  focus: '0 0 0 2px rgba(109, 74, 255, 0.3)',
  focusAccent: '0 0 0 2px rgba(0, 185, 107, 0.4)',
  ring: '0 0 0 1px rgba(109, 74, 255, 0.4)',
  ringFocus: '0 0 0 1px rgba(109, 74, 255, 0.4), 0 0 0 3px rgba(109, 74, 255, 0.2)',
} as const;

export const borderRadius = {
  sm: '8px',   // S
  md: '12px',  // M  
  lg: '16px',  // L (por defecto)
  xl: '24px',  // XL
  full: '9999px',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',  // Agregado según tu escala
} as const;
