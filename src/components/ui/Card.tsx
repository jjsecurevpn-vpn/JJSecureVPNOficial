/**
 * @file Card.tsx
 * @description Componente de tarjeta reutilizable con el diseño Proton
 */

import React, { forwardRef } from 'react';
import { colors, shadows, borderRadius, spacing } from '../../constants/theme';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'selected' | 'outline';
  padding?: keyof typeof spacing;
  children: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  variant = 'default',
  padding = 'xl',
  children,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'default':
        return {
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
          hoverColor: colors.background.secondary,
        };
      case 'interactive':
        return {
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
          hoverColor: colors.background.tertiary,
        };
      case 'selected':
        return {
          backgroundColor: colors.background.tertiary,
          borderColor: colors.brand.primary,
          hoverColor: colors.background.tertiary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: colors.border.secondary,
          hoverColor: colors.background.secondary,
        };
      default:
        return {
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
          hoverColor: colors.background.secondary,
        };
    }
  };

  const variantStyles = getVariantStyles();

  const cardStyle = {
    backgroundColor: variantStyles.backgroundColor,
    border: variant === 'selected' 
      ? `2px solid ${variantStyles.borderColor}` 
      : `1px solid ${variantStyles.borderColor}`,
    borderRadius: borderRadius.md,
    padding: spacing[padding],
    boxShadow: variant === 'selected' ? 'none' : shadows.card,
    transition: 'all 200ms ease-in-out',
    outline: 'none',
    ...style,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (variant === 'interactive') {
      e.currentTarget.style.backgroundColor = variantStyles.hoverColor;
    }
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = variantStyles.backgroundColor;
    onMouseLeave?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    if (variant === 'selected') {
      // Sin sombra brillosa para selected, solo mantener el borde profesional
      e.currentTarget.style.boxShadow = 'none';
    } else {
      e.currentTarget.style.boxShadow = `${shadows.card}, ${shadows.focus}`;
    }
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = variant === 'selected' ? 'none' : shadows.card;
    onBlur?.(e);
  };

  return (
    <div
      ref={ref}
      style={cardStyle}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';
