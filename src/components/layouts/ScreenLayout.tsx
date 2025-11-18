/**
 * @file ScreenLayout.tsx
 * @description Layout reutilizable para todas las pantallas de la aplicación.
 * Proporciona estructura consistente con header, fondo y navegación.
 */

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { colors, shadows } from '../../constants/theme';
import { useSafeArea } from '../../utils/deviceUtils';
import { useResponsive } from '../../hooks/useResponsive';
import { Text } from '../ui';

interface ScreenLayoutProps {
  /** Título de la pantalla que se muestra en el header */
  title?: string;
  
  /** Subtítulo opcional que se muestra debajo del título */
  subtitle?: string;
  
  /** Si true, muestra el botón de retroceso */
  showBackButton?: boolean;
  
  /** Función llamada cuando se presiona el botón de retroceso */
  onBackPress?: () => void;
  
  /** Si true, muestra el botón de menú/opciones */
  showMenuButton?: boolean;
  
  /** Función llamada cuando se presiona el botón de menú */
  onMenuPress?: () => void;
  
  /** Color de fondo personalizado. Si no se especifica, usa el fondo por defecto */
  backgroundColor?: string;
  
  /** Si true, el header se hace opaco al hacer scroll */
  enableScrollEffect?: boolean;
  
  /** Contenido personalizado para el header (reemplaza título/subtítulo) */
  headerContent?: React.ReactNode;
  
  /** Si true, oculta completamente el header */
  hideHeader?: boolean;
  
  /** Padding horizontal del contenido */
  horizontalPadding?: number;
  
  /** Padding vertical del contenido */
  verticalPadding?: number;
  
  /** Clase CSS adicional para el contenedor principal */
  className?: string;
  
  /** Estilos inline adicionales */
  style?: React.CSSProperties;
  
  /** Contenido de la pantalla */
  children: React.ReactNode;
  /** Desactiva el scroll interno del layout y deja que el hijo maneje el scroll */
  disableContentScroll?: boolean;
  /** Ignorar altura del footer (no resta ni añade padding inferior) */
  ignoreFooterHeight?: boolean;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  showMenuButton = false,
  onMenuPress,
  backgroundColor = colors.background.primary,
  enableScrollEffect = true,
  headerContent,
  hideHeader = false,
  horizontalPadding = 16,
  verticalPadding = 16,
  className = '',
  style = {},
  children,
  disableContentScroll = false,
  ignoreFooterHeight = false,
}) => {
  // Hooks
  const { statusBarHeight } = useSafeArea();
  const responsive = useResponsive();
  
  // Estado para efecto de scroll
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Calcular altura del header
  const headerHeight = hideHeader ? 0 : (subtitle && !headerContent ? 100 : 68);
  const totalHeaderHeight = hideHeader ? 0 : headerHeight + statusBarHeight;

  // Efecto de scroll
  useEffect(() => {
    if (!enableScrollEffect || hideHeader) return;

    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollTop = scrollRef.current.scrollTop;
        setIsScrolled(scrollTop > 20);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll, { passive: true });
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [enableScrollEffect, hideHeader]);

  // Colores del header basados en scroll
  const headerBg = isScrolled ? colors.background.secondary : backgroundColor;
  const showHeaderBorder = isScrolled;

  // Altura dinámica del footer expuesta por Footer (fallback a navigationBarHeight si no está aún medida)
  const footerHeightVar = ignoreFooterHeight ? '0px' : 'var(--app-footer-height)';
  // Fallback numérico para cálculos JS si se necesitara en el futuro (no requerido ahora)
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col ${className}`}
      style={{
        backgroundColor,
        // Prevenir estiramiento del contenedor principal
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Header */}
      {!hideHeader && (
        <div
          className="fixed inset-x-0 top-0 z-20"
          style={{
            height: totalHeaderHeight,
            backgroundColor: headerBg,
            borderBottom: showHeaderBorder 
              ? `1px solid ${colors.border.primary}` 
              : '1px solid transparent',
            boxShadow: showHeaderBorder ? shadows.card : 'none',
            transition: 'background-color 300ms ease, border-color 300ms ease, box-shadow 300ms ease',
          }}
        >
          {/* Área del status bar */}
          <div style={{ height: statusBarHeight }} />
          
          {/* Contenido del header */}
          <div
            className="flex items-center justify-between px-4"
            style={{ height: headerHeight }}
          >
            {/* Lado izquierdo - Botón de retroceso */}
            <div className="flex items-center">
              {showBackButton && (
                <button
                  onClick={onBackPress}
                  className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors hover:bg-surface-border/40"
                  style={{
                    backgroundColor: 'transparent',
                    color: colors.text.primary,
                  }}
                >
                  <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
                </button>
              )}
            </div>

            {/* Centro - Título/Contenido personalizado */}
            <div className="flex-1 mx-4">
              {headerContent ? (
                headerContent
              ) : (
                <div className="text-center">
                  {title && (
                    <Text
                      variant="h2"
                      color="primary"
                      as="h1"
                      size={responsive.isSmall ? 20 : 24}
                      className="transition-transform duration-300"
                      style={{
                        transform: isScrolled ? 'scale(0.92)' : 'scale(1)',
                        transformOrigin: 'center',
                      }}
                    >
                      {title}
                    </Text>
                  )}
                  {subtitle && !isScrolled && (
                    <Text
                      variant="body"
                      color="tertiary"
                      as="p"
                      size={responsive.isSmall ? 14 : 16}
                      className="mt-1"
                    >
                      {subtitle}
                    </Text>
                  )}
                </div>
              )}
            </div>

            {/* Lado derecho - Botón de menú */}
            <div className="flex items-center">
              {showMenuButton && (
                <button
                  onClick={onMenuPress}
                  className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors hover:bg-surface-border/40"
                  style={{
                    backgroundColor: 'transparent',
                    color: colors.text.primary,
                  }}
                >
                  <MoreVertical className="w-5 h-5" strokeWidth={1.5} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      {disableContentScroll ? (
        <div
          className="flex-1 flex flex-col"
          style={{
            paddingTop: totalHeaderHeight,
            // Usa la altura dinámica del footer para asegurar que el contenido no quede debajo
            paddingBottom: ignoreFooterHeight ? 0 : `calc(${footerHeightVar} + 8px)`,
            paddingLeft: horizontalPadding,
            paddingRight: horizontalPadding,
          }}
        >
          {children}
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex-1 overflow-auto scrollbar-hidden"
          style={{
            paddingTop: totalHeaderHeight,
            paddingBottom: ignoreFooterHeight ? 0 : `calc(${footerHeightVar} + 8px)`,
            scrollBehavior: 'smooth',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div
            style={{
              padding: `${verticalPadding}px ${horizontalPadding}px`,
              // Restar la altura del header y footer dinámico para asegurar altura mínima visible completa
              minHeight: ignoreFooterHeight ? `calc(100vh - ${totalHeaderHeight}px)` : `calc(100vh - ${totalHeaderHeight}px - ${footerHeightVar})`,
              maxHeight: 'fit-content',
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Hook para obtener configuraciones comunes del ScreenLayout
 */
export const useScreenLayoutDefaults = () => {
  const responsive = useResponsive();
  
  return {
    horizontalPadding: responsive.isSmall ? 12 : 16,
    verticalPadding: responsive.isSmall ? 16 : 20,
  };
};

export default ScreenLayout;