/**
 * @file typography.ts
 * @description Configuraciones de tipografía reutilizables
 */

export const fontFamilies = {
  primary: '"ABC Arizona Sans", "Inter", "Roboto", system-ui, sans-serif',
  display: '"ABC Arizona Flare", "Inter", "Roboto", system-ui, sans-serif',
  mono: '"ABC Arizona Sans", "Inter", "SF Mono", "Consolas", "Monaco", "Cascadia Code", monospace',
} as const;

/**
 * DEPRECADO: Las escalas tipográficas ahora viven en Tailwind (fontSize extend).
 * Mantenemos solo fontFamilies para casos puntuales (fuentes display/mono).
 */
export const textStyles = {} as const; // Placeholder para evitar imports rotos residuales
export const applyTextStyle = () => ({} as any); // No-op
