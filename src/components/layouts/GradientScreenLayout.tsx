/**
 * @file GradientScreenLayout.tsx
 * @description Layout especializado para pantallas con fondo degradado (como WelcomeScreen)
 * Extiende ScreenLayout con efectos visuales adicionales.
 */

import React from 'react';
import { ScreenLayout } from './ScreenLayout';
import './layouts.css';

interface GradientScreenLayoutProps {
  /** Título de la pantalla */
  title?: string;
  
  /** Subtítulo opcional */
  subtitle?: string;
  
  /** Si true, muestra el botón de retroceso */
  showBackButton?: boolean;
  
  /** Función llamada cuando se presiona el botón de retroceso */
  onBackPress?: () => void;
  
  /** Si true, muestra el botón de menú/opciones */
  showMenuButton?: boolean;
  
  /** Función llamada cuando se presiona el botón de menú */
  onMenuPress?: () => void;
  
  /** Contenido personalizado para el header */
  headerContent?: React.ReactNode;
  
  /** Si true, oculta completamente el header */
  hideHeader?: boolean;
  
  /** Si true, muestra partículas animadas en el fondo */
  showParticles?: boolean;
  
  /** Color base del gradiente */
  gradientBase?: string;
  
  /** Padding horizontal del contenido */
  horizontalPadding?: number;
  
  /** Padding vertical del contenido */
  verticalPadding?: number;
  
  /** Clase CSS adicional */
  className?: string;
  
  /** Estilos adicionales */
  style?: React.CSSProperties;
  
  /** Contenido de la pantalla */
  children: React.ReactNode;
  /** Desactivar gradiente por defecto (usaremos fondo propio externo) */
  disableBaseGradient?: boolean;
  /** Ignorar altura footer */
  ignoreFooterHeight?: boolean;
}

export const GradientScreenLayout: React.FC<GradientScreenLayoutProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  showMenuButton = false,
  onMenuPress,
  headerContent,
  hideHeader = false,
  showParticles = true,
  gradientBase = '#1a1a24',
  horizontalPadding = 16,
  verticalPadding = 16,
  className = '',
  style = {},
  children,
  disableBaseGradient = false,
  ignoreFooterHeight = true,
}) => {
  return (
    <ScreenLayout
      backgroundColor={disableBaseGradient ? 'transparent' : gradientBase}
      title={title}
      subtitle={subtitle}
      showBackButton={showBackButton}
      onBackPress={onBackPress}
      showMenuButton={showMenuButton}
      onMenuPress={onMenuPress}
      headerContent={headerContent}
      hideHeader={hideHeader}
      horizontalPadding={horizontalPadding}
      verticalPadding={verticalPadding}
      enableScrollEffect={false} // Los gradientes no cambian con scroll
      className={`${disableBaseGradient ? '' : 'bg-app-gradient'} ${className}`}
      style={{
        backgroundImage: disableBaseGradient ? undefined : `linear-gradient(135deg, ${gradientBase} 0%, #2a1a3a 35%, #1f1f32 70%, ${gradientBase} 100%)`,
        ...style,
      }}
      ignoreFooterHeight={ignoreFooterHeight}
    >
      {/* Partículas animadas */}
      {showParticles && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div 
            className="particle absolute w-2 h-2 bg-white rounded-full animate-pulse"
            style={{
              top: '5rem',
              left: '4rem',
              animation: 'particle-float 8s ease-in-out infinite',
            }}
          />
          <div 
            className="particle absolute w-1.5 h-1.5 bg-white rounded-full animate-pulse"
            style={{
              top: '8rem',
              right: '5rem',
              animation: 'particle-float 8s ease-in-out infinite',
              animationDelay: '2s',
            }}
          />
          <div 
            className="particle absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              bottom: '10rem',
              left: '5rem',
              animation: 'particle-float 8s ease-in-out infinite',
              animationDelay: '4s',
            }}
          />
          <div 
            className="particle absolute w-1.5 h-1.5 bg-white rounded-full animate-pulse"
            style={{
              bottom: '15rem',
              right: '4rem',
              animation: 'particle-float 8s ease-in-out infinite',
              animationDelay: '6s',
            }}
          />
        </div>
      )}
      
      {/* Contenido con z-index para estar sobre las partículas */}
      <div className="relative z-10">
        {children}
      </div>
    </ScreenLayout>
  );
};

export default GradientScreenLayout;