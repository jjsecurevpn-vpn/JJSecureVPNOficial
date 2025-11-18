/**
 * @file layout.ts
 * @description Tokens de layout específicos de SettingsScreen para evitar repetir ternarios scale()
 */
import { useResponsive } from '../../../../hooks/useResponsive';
import { useResponsiveScale } from '../../../../hooks/useResponsiveScale';

/** Devuelve padding horizontal estándar para secciones (20/22/24 escalado) */
export const useSectionHorizontalPadding = () => {
  const { isXSmall, isSmall } = useResponsive();
  const { scale } = useResponsiveScale({ type: 'component' });
  return isXSmall ? scale(20) : isSmall ? scale(22) : scale(24);
};

/** Devuelve padding horizontal compacto (16/18/20) */
export const useCompactHorizontalPadding = () => {
  const { isXSmall, isSmall } = useResponsive();
  const { scale } = useResponsiveScale({ type: 'component' });
  return isXSmall ? scale(16) : isSmall ? scale(18) : scale(20);
};

/** Devuelve margin top vertical para bloques (12/14/16) */
export const useBlockTopMargin = () => {
  const { isXSmall, isSmall } = useResponsive();
  const { scale } = useResponsiveScale({ type: 'component' });
  return isXSmall ? scale(12) : isSmall ? scale(14) : scale(16);
};

/** Helper genérico: devuelve scale(xs|sm|md) según breakpoint */
export const useResponsiveScaled = (xs: number, sm: number, md: number) => {
  const { isXSmall, isSmall } = useResponsive();
  const { scale } = useResponsiveScale({ type: 'component' });
  return scale(isXSmall ? xs : isSmall ? sm : md);
};

/** Márgenes específicos reutilizados en botones dentro de AccountSection */
export const useButtonMarginTopLarge = () => useResponsiveScaled(8, 10, 12); // Para segundo botón
export const useButtonMarginTopSmall = () => useResponsiveScaled(4, 6, 8);   // Para tercer botón
export const useFooterMarginTop = () => useResponsiveScaled(48, 54, 60);     // FooterSection margen superior
export const useFooterHorizontalPadding = () => useResponsiveScaled(16, 18, 20); // FooterSection padding lateral
