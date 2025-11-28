/**
 * @file Text.tsx
 * @description Componente de texto reutilizable con escalado responsivo automático
 */

import React, { forwardRef, useMemo } from 'react';
import { useResponsiveText, useResponsiveValue } from '../../hooks/useResponsiveScale';
import { type Breakpoint } from '../../hooks/useResponsive';
// Eliminamos dependencia directa de textStyles para migrar a Tailwind utility-first
import { colors } from '../../constants/theme';

// Tipos para propiedades responsivas
type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;
type TextAlignValue = 'left' | 'center' | 'right' | 'justify';

const PRESET_SIZE_MAP = {
  xs: { fontSize: 12, lineHeight: 16 },
  sm: { fontSize: 14, lineHeight: 20 },
  md: { fontSize: 16, lineHeight: 24 },
  lg: { fontSize: 18, lineHeight: 28 },
  xl: { fontSize: 20, lineHeight: 28 },
} as const;

const WEIGHT_MAP = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

const toPxString = (value: string | number) => (typeof value === 'number' ? `${value}px` : value);

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

export const Text = forwardRef<unknown, TextProps>(({
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

  const resolvedSize = useResponsiveValue<string | number | undefined>(
    (size ?? undefined) as ResponsiveValue<string | number | undefined>,
  );
  const resolvedWeight = useResponsiveValue<string | number | undefined>(
    (weight ?? undefined) as ResponsiveValue<string | number | undefined>,
  );
  const resolvedAlign = useResponsiveValue<TextAlignValue | undefined>(
    (align ?? undefined) as ResponsiveValue<TextAlignValue | undefined>,
  );
  const resolvedLineHeight = useResponsiveValue<string | number | undefined>(
    (lineHeight ?? undefined) as ResponsiveValue<string | number | undefined>,
  );

  const sizeStyle = useMemo(() => {
    if (resolvedSize === undefined) return {};

    if (typeof resolvedSize === 'string' && resolvedSize in PRESET_SIZE_MAP) {
      const config = PRESET_SIZE_MAP[resolvedSize as keyof typeof PRESET_SIZE_MAP];
      if (disableScaling) {
        return {
          fontSize: toPxString(config.fontSize),
          lineHeight: toPxString(config.lineHeight),
        };
      }

      return {
        fontSize: scaleFontSize(config.fontSize),
        lineHeight: scaleFontSize(config.lineHeight),
      };
    }

    if (disableScaling) {
      return {
        fontSize: toPxString(resolvedSize),
      };
    }

    return {
      fontSize: scaleFontSize(resolvedSize),
    };
  }, [resolvedSize, disableScaling, scaleFontSize]);

  const weightStyle = useMemo(() => {
    if (resolvedWeight === undefined) return {};

    if (typeof resolvedWeight === 'string') {
      return { fontWeight: WEIGHT_MAP[resolvedWeight as keyof typeof WEIGHT_MAP] ?? 400 };
    }

    if (typeof resolvedWeight === 'number') {
      return { fontWeight: resolvedWeight };
    }

    return {};
  }, [resolvedWeight]);

  const lineHeightStyle = useMemo(() => {
    if (resolvedLineHeight === undefined) return {};

    if (disableScaling) {
      return { lineHeight: toPxString(resolvedLineHeight) };
    }

    return { lineHeight: scaleFontSize(resolvedLineHeight) };
  }, [resolvedLineHeight, disableScaling, scaleFontSize]);

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

  const textStyle: React.CSSProperties = {
    ...sizeStyle,
    ...weightStyle,
    ...lineHeightStyle,
    color: getTextColor(),
    textAlign: resolvedAlign,
    ...(truncate && {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap' as const,
    }),
    ...style,
  };

  const variantClasses = variantClassMap[variant] || '';
  const existingClassName = (props as Record<string, unknown>).className || '';

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
