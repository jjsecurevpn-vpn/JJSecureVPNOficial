/**
 * @file animations.ts
 * @description Animaciones y efectos reutilizables
 */

export const animations = {
  // Nota: usamos utilidades Tailwind para animaciones (animate-fade-in, animate-pulse, animate-spin)
  // Conservamos sólo las transiciones de uso real en componentes TSX
  transition: {
    micro: 'all 150ms ease-in-out',     // micro interactions
    hover: 'all 200ms ease-in-out',     // hover/focus
    modal: 'all 250ms ease-in-out',     // modales
  },
} as const;
