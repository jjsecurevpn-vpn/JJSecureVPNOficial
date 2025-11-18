/**
 * @file FooterTabButton.tsx
 * @description Componente reutilizable para botones del footer de navegación
 */

import { colors } from '../../constants/theme';
import type { TabItem } from '../../constants/navigationConfig';
import { ResponsiveBox } from './ResponsiveBox';
import { useResponsive } from '../../hooks/useResponsive';
import { useResponsiveScale } from '../../hooks/useResponsiveScale';

interface FooterTabButtonProps {
  item: TabItem;
  isActive: boolean;
  onClick: () => void;
}

export function FooterTabButton({ item, isActive, onClick }: FooterTabButtonProps) {
  // Hooks responsivos
  const { isXSmall } = useResponsive();
  const { scale } = useResponsiveScale({ type: 'component' });
  
  const IconComponent = item.icon;
  // Dimensiones del "globo" (pill) adaptadas al modo ultra-compacto
  const pillWidth = scale(isXSmall ? 48 : 56); // ancho horizontal del pill
  const pillHeight = scale(isXSmall ? 28 : 32); // alto del pill
  
  return (
  <>
      <ResponsiveBox
        as="button"
        onClick={onClick}
        display="flex"
  style={{ flex: 1, backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={{ xs: 1, sm: 2, md: 2 }}
        py={{ xs: isXSmall ? 3 : 4, sm: 6, md: 6 }}
        px={{ xs: isXSmall ? 1 : 2, sm: 3, md: 4 }}
        borderRadius={{ xs: 6, sm: 8, md: 8 }}
        className={`transition-all duration-200 touch-manipulation footer-tab-button ${isXSmall ? 'footer-tab-ultra-compact' : ''}`}
        aria-label={item.label}
        {...(item.id === 'servers' && { 'data-tutorial': 'servers-menu' })}
        {...(item.id === 'profile' && { 'data-tutorial': 'user-profile' })}
        {...(item.id === 'settings' && { 'data-tutorial': 'settings-menu' })}
      >
      {/* Contenedor del icono + pill */}
      <ResponsiveBox
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        style={{
          width: pillWidth,
          height: pillHeight,
        }}
        className="footer-icon-wrapper"
      >
        {/* Pill solo cuando está activo */}
        {isActive && (
          <span
            className="footer-icon-pill active"
            style={{
              width: pillWidth,
              height: pillHeight,
              background: colors.brand.primary,
              border: `1px solid ${colors.brand.primary}`,
              opacity: 1,
              transition: 'background-color 160ms ease, opacity 160ms ease'
            }}
            aria-hidden="true"
          />
        )}
        {/* Icono centrado */}
        <ResponsiveBox 
          display="flex"
          alignItems="center"
          justifyContent="center"
          height={{ xs: isXSmall ? 20 : 24, sm: 24, md: 24 }}
          width={{ xs: isXSmall ? 20 : 24, sm: 24, md: 24 }}
          className="transition-all duration-200 footer-icon-container"
          style={{
            color: isActive ? '#ffffff' : colors.text.tertiary,
            zIndex: 2,
            // Si no hay pill, damos un pequeño fondo hover muy sutil sólo para feedback táctil
            ...(isActive ? {} : { })
          }}
        >
          <IconComponent
            width={scale(isXSmall ? 15 : 18)}
            height={scale(isXSmall ? 15 : 18)}
            className="transition-all duration-200"
            strokeWidth={1.5}
            {...(isActive && item.id === "home" ? item.iconProps : {})}
          />
        </ResponsiveBox>
      </ResponsiveBox>
      
      {/* Label */}
      <ResponsiveBox
        as="p"
        fontSize={{ xs: isXSmall ? 7 : 8, sm: 9, md: 10 }}
        className="footer-label"
        style={{
          color: isActive ? colors.brand.primary : colors.text.tertiary,
          letterSpacing: isXSmall ? '0.1px' : '0.2px',
          fontWeight: 500,
          lineHeight: 1.2,
          margin: 0,
          textAlign: 'center',
          display: isXSmall ? 'none' : 'block'
        }}
      >
        {item.label}
      </ResponsiveBox>
    </ResponsiveBox>
    </>
  );
}
