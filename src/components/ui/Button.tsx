/**
 * @file Button.tsx
 * @description Componente de botón reutilizable con escalado responsivo automático
 */

import React, { forwardRef, useMemo } from 'react';
import { useResponsiveButton, useResponsiveValue } from '../../hooks/useResponsiveScale';
import { useResponsive, type Breakpoint } from '../../hooks/useResponsive';
import { colors, shadows, borderRadius } from '../../constants/theme';
import { animations } from '../../constants/animations';

// Tipos para propiedades responsivas
type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante visual del botón */
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger';
  
  /** Tamaño del botón responsivo */
  size?: ResponsiveValue<'small' | 'medium' | 'large'>;
  
  /** Ancho completo */
  fullWidth?: boolean;
  
  /** Padding personalizado responsivo */
  padding?: ResponsiveValue<string | number>;
  
  /** Height personalizado responsivo */
  height?: ResponsiveValue<string | number>;
  
  /** Font size personalizado responsivo */
  fontSize?: ResponsiveValue<string | number>;
  
  /** Border radius personalizado responsivo */
  borderRadius?: ResponsiveValue<string | number>;
  
  /** Deshabilitar escalado automático */
  disableScaling?: boolean;
  
  children: React.ReactNode;
}

const SIZE_CONFIGS = {
  small: {
    padding: '8px 16px',
    fontSize: 14,
    minHeight: 32,
  },
  medium: {
    padding: '12px 20px',
    fontSize: 16,
    minHeight: 40,
  },
  large: {
    padding: '16px 24px',
    fontSize: 18,
    minHeight: 48,
  },
} as const;

const toPxString = (value: string | number) => (typeof value === 'number' ? `${value}px` : value);

const getVariantStyles = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: colors.accent.primary,
        color: colors.text.primary,
        border: 'none',
        hoverColor: colors.accent.strong,
      };
    case 'secondary':
      return {
        backgroundColor: colors.background.secondary,
        color: colors.text.primary,
        border: `1px solid ${colors.border.secondary}`,
        hoverColor: colors.background.tertiary,
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        color: colors.text.secondary,
        border: `1px solid ${colors.border.secondary}`,
        hoverColor: colors.background.tertiary,
      };
    case 'success':
      return {
        backgroundColor: colors.status.success,
        color: colors.text.primary,
        border: 'none',
        hoverColor: colors.accent?.strong || colors.status.success,
      };
    case 'danger':
      return {
        backgroundColor: colors.status.error,
        color: colors.text.primary,
        border: 'none',
        // Usar misma base (sin hex crudo) hasta definir shade en tokens
        hoverColor: colors.status.error,
      };
    default:
      return {
        backgroundColor: colors.accent.primary,
        color: colors.text.primary,
        border: 'none',
        hoverColor: colors.accent.strong,
      };
  }
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  padding,
  height,
  fontSize,
  borderRadius: customBorderRadius,
  disableScaling = false,
  children,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const { spacing, fontSize: scaleFontSize } = useResponsiveButton();
  useResponsive(); // mantener hook para posibles efectos de layout aunque no se use directamente
  
  const responsiveSize = useResponsiveValue(size);
  const responsivePadding = useResponsiveValue<string | number | undefined>(
    (padding ?? undefined) as ResponsiveValue<string | number | undefined>,
  );
  const responsiveHeight = useResponsiveValue<string | number | undefined>(
    (height ?? undefined) as ResponsiveValue<string | number | undefined>,
  );
  const responsiveFontSize = useResponsiveValue<string | number | undefined>(
    (fontSize ?? undefined) as ResponsiveValue<string | number | undefined>,
  );
  const responsiveBorderRadius = useResponsiveValue<string | number | undefined>(
    (customBorderRadius ?? undefined) as ResponsiveValue<string | number | undefined>,
  );

  const sizeStyles = useMemo(() => {
    const config = SIZE_CONFIGS[responsiveSize as keyof typeof SIZE_CONFIGS] || SIZE_CONFIGS.medium;

    if (disableScaling) {
      return {
        padding: config.padding,
        fontSize: toPxString(config.fontSize),
        minHeight: toPxString(config.minHeight),
      };
    }

    return {
      padding: spacing(config.padding),
      fontSize: scaleFontSize(config.fontSize),
      minHeight: spacing(config.minHeight),
    };
  }, [responsiveSize, disableScaling, spacing, scaleFontSize]);

  const customStyles = useMemo(() => {
    const styles: React.CSSProperties = {};

    if (responsivePadding !== undefined) {
      styles.padding = disableScaling ? toPxString(responsivePadding) : spacing(responsivePadding);
    }

    if (responsiveHeight !== undefined) {
      styles.height = disableScaling ? toPxString(responsiveHeight) : spacing(responsiveHeight);
    }

    if (responsiveFontSize !== undefined) {
      styles.fontSize = disableScaling ? toPxString(responsiveFontSize) : scaleFontSize(responsiveFontSize);
    }

    if (responsiveBorderRadius !== undefined) {
      styles.borderRadius = disableScaling ? toPxString(responsiveBorderRadius) : spacing(responsiveBorderRadius);
    }

    return styles;
  }, [responsivePadding, responsiveHeight, responsiveFontSize, responsiveBorderRadius, disableScaling, spacing, scaleFontSize]);

  const variantStyles = useMemo(() => getVariantStyles(variant), [variant]);

  const buttonStyle: React.CSSProperties = {
    ...sizeStyles,
    ...customStyles,
    backgroundColor: variantStyles.backgroundColor,
    color: variantStyles.color,
    border: variantStyles.border,
    borderRadius: customStyles.borderRadius || (disableScaling ? borderRadius.md : spacing(borderRadius.md)),
    cursor: 'pointer',
    transition: animations.transition.hover,
    outline: 'none',
    width: fullWidth ? '100%' : 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'inherit',
    fontWeight: 600,
    letterSpacing: '0px',
    ...style,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = variantStyles.hoverColor;
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = variantStyles.backgroundColor;
    onMouseLeave?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    e.currentTarget.style.boxShadow = variant === 'primary' ? shadows.focusAccent : shadows.focus;
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    e.currentTarget.style.boxShadow = 'none';
    onBlur?.(e);
  };

  return (
    <button
      ref={ref}
      style={buttonStyle}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';
