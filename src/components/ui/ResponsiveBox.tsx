/**
 * @file ResponsiveBox.tsx
 * @description Componente Box universal con escalado automático responsivo
 */

import React, { forwardRef } from 'react';
import { useResponsiveScale, useResponsiveValue } from '../../hooks/useResponsiveScale';
import type { Breakpoint } from '../../hooks/useResponsive';
import type { ScaleType } from '../../utils/responsiveScale';

// Tipos para propiedades responsivas
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

export interface ResponsiveBoxProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  /** Tipo de escalado a aplicar */
  scaleType?: ScaleType;
  
  /** Elemento HTML a renderizar */
  as?: React.ElementType;
  
  /** Width responsivo */
  width?: ResponsiveValue<string | number>;
  
  /** Height responsivo */
  height?: ResponsiveValue<string | number>;
  
  /** Max width responsivo */
  maxWidth?: ResponsiveValue<string | number>;
  
  /** Max height responsivo */
  maxHeight?: ResponsiveValue<string | number>;
  
  /** Min width responsivo */
  minWidth?: ResponsiveValue<string | number>;
  
  /** Min height responsivo */
  minHeight?: ResponsiveValue<string | number>;
  
  /** Padding responsivo */
  padding?: ResponsiveValue<string | number>;
  
  /** Padding horizontal responsivo */
  px?: ResponsiveValue<string | number>;
  
  /** Padding vertical responsivo */
  py?: ResponsiveValue<string | number>;
  
  /** Padding top responsivo */
  pt?: ResponsiveValue<string | number>;
  
  /** Padding right responsivo */
  pr?: ResponsiveValue<string | number>;
  
  /** Padding bottom responsivo */
  pb?: ResponsiveValue<string | number>;
  
  /** Padding left responsivo */
  pl?: ResponsiveValue<string | number>;
  
  /** Margin responsivo */
  margin?: ResponsiveValue<string | number>;
  
  /** Margin horizontal responsivo */
  mx?: ResponsiveValue<string | number>;
  
  /** Margin vertical responsivo */
  my?: ResponsiveValue<string | number>;
  
  /** Margin top responsivo */
  mt?: ResponsiveValue<string | number>;
  
  /** Margin right responsivo */
  mr?: ResponsiveValue<string | number>;
  
  /** Margin bottom responsivo */
  mb?: ResponsiveValue<string | number>;
  
  /** Margin left responsivo */
  ml?: ResponsiveValue<string | number>;
  
  /** Font size responsivo */
  fontSize?: ResponsiveValue<string | number>;
  
  /** Line height responsivo */
  lineHeight?: ResponsiveValue<string | number>;
  
  /** Border radius responsivo */
  borderRadius?: ResponsiveValue<string | number>;
  
  /** Gap para flexbox/grid responsivo */
  gap?: ResponsiveValue<string | number>;
  
  /** Background color */
  bg?: string;
  
  /** Text color */
  color?: string;
  
  /** Display type */
  display?: ResponsiveValue<React.CSSProperties['display']>;
  
  /** Flex direction */
  flexDirection?: ResponsiveValue<React.CSSProperties['flexDirection']>;
  
  /** Justify content */
  justifyContent?: ResponsiveValue<React.CSSProperties['justifyContent']>;
  
  /** Align items */
  alignItems?: ResponsiveValue<React.CSSProperties['alignItems']>;
  
  /** Flex wrap */
  flexWrap?: ResponsiveValue<React.CSSProperties['flexWrap']>;
  
  /** Text align */
  textAlign?: ResponsiveValue<React.CSSProperties['textAlign']>;
  
  /** Position */
  position?: ResponsiveValue<React.CSSProperties['position']>;
  
  /** Z-index */
  zIndex?: ResponsiveValue<number>;
  
  /** Overflow */
  overflow?: ResponsiveValue<React.CSSProperties['overflow']>;
  
  /** Overflow X */
  overflowX?: ResponsiveValue<React.CSSProperties['overflowX']>;
  
  /** Overflow Y */
  overflowY?: ResponsiveValue<React.CSSProperties['overflowY']>;
  
  /** Deshabilitar escalado automático */
  disableScaling?: boolean;
  
  children?: React.ReactNode;
}

export const ResponsiveBox = forwardRef<HTMLElement, ResponsiveBoxProps>(({
  scaleType = 'component',
  as: Component = 'div',
  width,
  height,
  maxWidth,
  maxHeight,
  minWidth,
  minHeight,
  padding,
  px,
  py,
  pt,
  pr,
  pb,
  pl,
  margin,
  mx,
  my,
  mt,
  mr,
  mb,
  ml,
  fontSize,
  lineHeight,
  borderRadius,
  gap,
  bg,
  color,
  display,
  flexDirection,
  justifyContent,
  alignItems,
  flexWrap,
  textAlign,
  position,
  zIndex,
  overflow,
  overflowX,
  overflowY,
  disableScaling = false,
  children,
  style,
  ...props
}, ref) => {
  const { spacing, fontSize: scaleFontSize } = useResponsiveScale({ type: scaleType });
  
  // Obtener todos los valores responsivos al principio para evitar violaciones de hooks
  const responsiveWidth = useResponsiveValue(width);
  const responsiveHeight = useResponsiveValue(height);
  const responsiveMaxWidth = useResponsiveValue(maxWidth);
  const responsiveMaxHeight = useResponsiveValue(maxHeight);
  const responsiveMinWidth = useResponsiveValue(minWidth);
  const responsiveMinHeight = useResponsiveValue(minHeight);
  const responsivePadding = useResponsiveValue(padding);
  const responsivePx = useResponsiveValue(px);
  const responsivePy = useResponsiveValue(py);
  const responsivePt = useResponsiveValue(pt);
  const responsivePr = useResponsiveValue(pr);
  const responsivePb = useResponsiveValue(pb);
  const responsivePl = useResponsiveValue(pl);
  const responsiveMargin = useResponsiveValue(margin);
  const responsiveMx = useResponsiveValue(mx);
  const responsiveMy = useResponsiveValue(my);
  const responsiveMt = useResponsiveValue(mt);
  const responsiveMr = useResponsiveValue(mr);
  const responsiveMb = useResponsiveValue(mb);
  const responsiveMl = useResponsiveValue(ml);
  const responsiveFontSize = useResponsiveValue(fontSize);
  const responsiveLineHeight = useResponsiveValue(lineHeight);
  const responsiveBorderRadius = useResponsiveValue(borderRadius);
  const responsiveGap = useResponsiveValue(gap);
  const responsiveDisplay = useResponsiveValue(display);
  const responsiveFlexDirection = useResponsiveValue(flexDirection);
  const responsiveJustifyContent = useResponsiveValue(justifyContent);
  const responsiveAlignItems = useResponsiveValue(alignItems);
  const responsiveFlexWrap = useResponsiveValue(flexWrap);
  const responsiveTextAlign = useResponsiveValue(textAlign);
  const responsivePosition = useResponsiveValue(position);
  const responsiveZIndex = useResponsiveValue(zIndex);
  const responsiveOverflow = useResponsiveValue(overflow);
  const responsiveOverflowX = useResponsiveValue(overflowX);
  const responsiveOverflowY = useResponsiveValue(overflowY);
  
  // Funciones helper para convertir valores (sin hooks)
  const processValue = (value: string | number | undefined, isSpacing = false): string | number | undefined => {
    if (value === undefined) return undefined;
    
    if (disableScaling) {
      return typeof value === 'number' ? `${value}px` : value;
    }
    
    if (isSpacing && typeof value === 'number') {
      return spacing(value);
    }
    
    if (typeof value === 'number') {
      return `${value}px`;
    }
    
    return value;
  };
  
  const processFontSize = (value: string | number | undefined): string | undefined => {
    if (value === undefined) return undefined;
    
    if (disableScaling) {
      return typeof value === 'number' ? `${value}px` : value;
    }
    
    return scaleFontSize(value);
  };
  
  // Construir estilos
  const responsiveStyles: React.CSSProperties = {
    // Dimensiones
    width: processValue(responsiveWidth),
    height: processValue(responsiveHeight),
    maxWidth: processValue(responsiveMaxWidth),
    maxHeight: processValue(responsiveMaxHeight),
    minWidth: processValue(responsiveMinWidth),
    minHeight: processValue(responsiveMinHeight),
    
    // Padding
    padding: processValue(responsivePadding, true),
    paddingLeft: processValue(responsivePx || responsivePl, true),
    paddingRight: processValue(responsivePx || responsivePr, true),
    paddingTop: processValue(responsivePy || responsivePt, true),
    paddingBottom: processValue(responsivePy || responsivePb, true),
    
    // Margin
    margin: processValue(responsiveMargin, true),
    marginLeft: processValue(responsiveMx || responsiveMl, true),
    marginRight: processValue(responsiveMx || responsiveMr, true),
    marginTop: processValue(responsiveMy || responsiveMt, true),
    marginBottom: processValue(responsiveMy || responsiveMb, true),
    
    // Tipografía
    fontSize: processFontSize(responsiveFontSize),
    lineHeight: processValue(responsiveLineHeight),
    
    // Otros
    borderRadius: processValue(responsiveBorderRadius),
    gap: processValue(responsiveGap, true),
    backgroundColor: bg,
    color,
    
    // Layout
    display: responsiveDisplay,
    flexDirection: responsiveFlexDirection,
    justifyContent: responsiveJustifyContent,
    alignItems: responsiveAlignItems,
    flexWrap: responsiveFlexWrap,
    textAlign: responsiveTextAlign,
    position: responsivePosition,
    zIndex: responsiveZIndex,
    overflow: responsiveOverflow,
    overflowX: responsiveOverflowX,
    overflowY: responsiveOverflowY,
  };
  
  // Filtrar valores undefined
  const cleanStyles = Object.fromEntries(
    Object.entries(responsiveStyles).filter(([_, value]) => value !== undefined)
  ) as React.CSSProperties;
  
  const finalStyle: React.CSSProperties = {
    ...cleanStyles,
    ...style,
  };
  
  const ElementComponent = Component as React.ElementType;
  
  return (
    <ElementComponent
      ref={ref as any}
      style={finalStyle}
      {...props}
    >
      {children}
    </ElementComponent>
  ) as React.ReactElement;
});

ResponsiveBox.displayName = 'ResponsiveBox';

// Componentes especializados basados en ResponsiveBox
export const Flex = forwardRef<HTMLElement, ResponsiveBoxProps>((props, ref) => (
  <ResponsiveBox ref={ref} display="flex" {...props} />
));

export const Grid = forwardRef<HTMLElement, ResponsiveBoxProps>((props, ref) => (
  <ResponsiveBox ref={ref} display="grid" {...props} />
));

export const Container = forwardRef<HTMLElement, ResponsiveBoxProps>((props, ref) => (
  <ResponsiveBox 
    ref={ref} 
    maxWidth={{ xs: '100%', sm: '100%', md: '100%', lg: '1200px', xl: '1400px' }}
    mx="auto"
    px={{ xs: 16, sm: 20, md: 24, lg: 32, xl: 40 }}
    {...props} 
  />
));

export const Stack = forwardRef<HTMLElement, ResponsiveBoxProps & { spacing?: ResponsiveValue<string | number> }>(({ 
  spacing: stackSpacing = 16, 
  ...props 
}, ref) => (
  <ResponsiveBox 
    ref={ref} 
    display="flex" 
    flexDirection="column" 
    gap={stackSpacing}
    {...props} 
  />
));

export const HStack = forwardRef<HTMLElement, ResponsiveBoxProps & { spacing?: ResponsiveValue<string | number> }>(({ 
  spacing: stackSpacing = 16, 
  ...props 
}, ref) => (
  <ResponsiveBox 
    ref={ref} 
    display="flex" 
    flexDirection="row" 
    gap={stackSpacing}
    {...props} 
  />
));

Flex.displayName = 'Flex';
Grid.displayName = 'Grid';
Container.displayName = 'Container';
Stack.displayName = 'Stack';
HStack.displayName = 'HStack';
