/**
 * @file Text.tsx
 * @description Componente de texto reutilizable con escalado responsivo automático
 */

import React, { forwardRef } from 'react';
import { useResponsiveText, useResponsiveValue } from '../../hooks/useResponsiveScale';
import { useResponsive, type Breakpoint } from '../../hooks/useResponsive';
// Eliminamos dependencia directa de textStyles para migrar a Tailwind utility-first
import { colors } from '../../constants/theme';

// Tipos para propiedades responsivas
type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** Variante de texto del sistema de diseño */
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'bodyLarge' | 'body' | 'bodySmall' | 'caption' | 'button' | 'buttonSmall' | 'label' | 'overline' | 'price' | 'priceSmall' | 'code' | 'codeSmall';
  
  /** Color del texto */
  color?: keyof typeof colors.text | 'brand' | 'accent' | 'custom';
  
  /** Color personalizado */
  customColor?: string;
  
  /** Tamaño de fuente responsivo */
  size?: ResponsiveValue<'xs' | 'sm' | 'md' | 'lg' | 'xl'> | ResponsiveValue<string | number>;
  
  /** Peso de la fuente responsivo */
  weight?: ResponsiveValue<'normal' | 'medium' | 'semibold' | 'bold'> | ResponsiveValue<number>;
  
  /** Alineación del texto responsiva */
  align?: ResponsiveValue<'left' | 'center' | 'right' | 'justify'>;
  
  /** Line height responsivo */
  lineHeight?: ResponsiveValue<string | number>;
  
  /** Habilitar truncado */
  truncate?: boolean;
  
  /** Elemento HTML a renderizar */
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  
  /** Deshabilitar escalado automático */
  disableScaling?: boolean;
  
  children: React.ReactNode;
}

export const Text = forwardRef<HTMLElement, TextProps>(({
  variant = 'body',
  color = 'primary',
  customColor,
  size,
  weight,
  align,
  lineHeight,
  truncate = false,
  as: Component = 'span',
  disableScaling = false,
  children,
  style,
  ...props
}, ref) => {
  const { fontSize: scaleFontSize } = useResponsiveText();
  
  const getTextColor = () => {
    if (customColor) return customColor;
    
    switch (color) {
      case 'brand':
        return colors.brand.primary;
      case 'accent':
        return colors.accent.primary;
      case 'custom':
        return customColor || colors.text.primary;
      default:
        return colors.text[color as keyof typeof colors.text] || colors.text.primary;
    }
  };

  const getSizeStyle = () => {
    if (!size) return {};
    
    const responsiveSize = useResponsiveValue(size);
    
    // Si es un tamaño predefinido
    if (typeof responsiveSize === 'string' && ['xs', 'sm', 'md', 'lg', 'xl'].includes(responsiveSize)) {
      const sizeMap = {
        xs: { fontSize: 12, lineHeight: 16 },
        sm: { fontSize: 14, lineHeight: 20 },
        md: { fontSize: 16, lineHeight: 24 },
        lg: { fontSize: 18, lineHeight: 28 },
        xl: { fontSize: 20, lineHeight: 28 },
      };
      
      const sizeConfig = sizeMap[responsiveSize as keyof typeof sizeMap];
      
      if (disableScaling) {
        return {
          fontSize: `${sizeConfig.fontSize}px`,
          lineHeight: `${sizeConfig.lineHeight}px`,
        };
      }
      
      return {
        fontSize: scaleFontSize(sizeConfig.fontSize),
        lineHeight: scaleFontSize(sizeConfig.lineHeight),
      };
    }
    
    // Si es un valor numérico o string personalizado
    if (responsiveSize !== undefined) {
      if (disableScaling) {
        return {
          fontSize: typeof responsiveSize === 'number' ? `${responsiveSize}px` : responsiveSize,
        };
      }
      
      return {
        fontSize: scaleFontSize(responsiveSize),
      };
    }
    
    return {};
  };

  const getWeightStyle = () => {
    if (!weight) return {};
    
    const responsiveWeight = useResponsiveValue(weight);
    
    if (typeof responsiveWeight === 'string') {
      const weightMap = {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      };
      
      return { fontWeight: weightMap[responsiveWeight] || 400 };
    }
    
    if (typeof responsiveWeight === 'number') {
      return { fontWeight: responsiveWeight };
    }
    
    return {};
  };

  const getLineHeightStyle = () => {
    if (!lineHeight) return {};
    
    const responsiveLineHeight = useResponsiveValue(lineHeight);
    
    if (responsiveLineHeight !== undefined) {
      if (disableScaling) {
        return {
          lineHeight: typeof responsiveLineHeight === 'number' 
            ? `${responsiveLineHeight}px` 
            : responsiveLineHeight,
        };
      }
      
      return {
        lineHeight: scaleFontSize(responsiveLineHeight),
      };
    }
    
    return {};
  };

  // Obtener estilos base de la variante
  // Mapeo de variantes a clases Tailwind (font-size/line-height definidas en theme extend fontSize)
  const variantClassMap: Record<string, string> = {
    h1: 'text-h1 font-bold',
    h2: 'text-h2 font-semibold',
    h3: 'text-h3 font-semibold',
    h4: 'text-h4 font-semibold',
    bodyLarge: 'text-body-lg',
    body: 'text-body',
    bodySmall: 'text-body-sm',
    caption: 'text-caption',
    button: 'text-btn font-semibold',
    buttonSmall: 'text-btn-sm font-medium',
    label: 'text-label font-medium',
    overline: 'text-overline font-semibold uppercase tracking-wide',
    price: 'text-price font-bold',
    priceSmall: 'text-price-sm font-semibold',
    code: 'text-code font-mono',
    codeSmall: 'text-code-sm font-mono'
  };

  const baseStyles: React.CSSProperties = {};
  
  // Aplicar escalado automático a los estilos base si no está deshabilitado
  const scaledBaseStyles = baseStyles; // Ahora las escalas vienen de clases, no de estilos inline

  const textStyle: React.CSSProperties = {
    ...scaledBaseStyles,
    ...getSizeStyle(),
    ...getWeightStyle(),
    ...getLineHeightStyle(),
    color: getTextColor(),
    textAlign: useResponsiveValue(align),
    ...(truncate && {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
    }),
    ...style,
  };

  const variantClasses = variantClassMap[variant] || '';
  const existingClassName = (props as any).className || '';

  return (
    <Component
      ref={ref as any}
      style={textStyle}
      className={`${variantClasses} ${existingClassName}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
});

Text.displayName = 'Text';
