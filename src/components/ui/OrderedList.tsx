/**
 * @file OrderedList.tsx
 * @description Lista numerada con círculos y manejo responsivo de overflow
 */

import React from 'react';
import { Text, Stack } from './';
import { colors, borderRadius } from '../../constants/theme';
import { useResponsiveSpacing } from '../../hooks/useResponsiveScale';
import { useResponsive } from '../../hooks/useResponsive';

export interface OrderedListItem {
  content: React.ReactNode;
}

export interface OrderedListProps {
  items: OrderedListItem[];
  numberColor?: string;
  numberBgColor?: string;
  spacing?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
}

export function OrderedList({ 
  items, 
  numberColor = colors.brand?.soft || colors.accent.primary,
  numberBgColor = `${colors.brand?.primary || colors.accent.primary}20`,
  spacing: itemSpacing = { xs: 8, sm: 10, md: 12, lg: 14, xl: 16 }
}: OrderedListProps) {
  const { isSmall } = useResponsive();
  const { spacing } = useResponsiveSpacing();
  
  const gap = typeof itemSpacing === 'number' 
    ? spacing(itemSpacing)
    : spacing(itemSpacing[isSmall ? 'xs' : 'md'] || 12);
  
  const circleSize = isSmall ? 20 : 24;
  const fontSize = isSmall ? 10 : 12;
  
  return (
    <Stack spacing={itemSpacing}>
      {items.map((item, index) => (
        <div 
          key={index}
          style={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            gap,
            width: '100%'
          }}
        >
          <div 
            style={{ 
              width: `${circleSize}px`, 
              height: `${circleSize}px`, 
              borderRadius: borderRadius.sm, 
              backgroundColor: numberBgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: numberColor,
              fontSize: `${fontSize}px`,
              fontWeight: 500,
              flexShrink: 0 
            }} 
          >
            {index + 1}
          </div>
          <div style={{ 
            flex: 1, 
            minWidth: 0, // Permite que el contenido se contraiga
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            maxWidth: '100%'
          }}>
            {typeof item.content === 'string' ? (
              <Text 
                variant={isSmall ? "bodySmall" : "body"} 
                color="secondary" 
                style={{ 
                  wordBreak: 'break-word',
                  lineHeight: '1.4',
                  margin: 0
                }}
              >
                {item.content}
              </Text>
            ) : (
              item.content
            )}
          </div>
        </div>
      ))}
    </Stack>
  );
}
