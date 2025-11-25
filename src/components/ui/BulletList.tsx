/**
 * @file BulletList.tsx
 * @description Lista con bullets personalizados y manejo responsivo de overflow
 */

import React from 'react';
import { Text, Stack } from './';
import { colors } from '../../constants/theme';
import { useResponsiveSpacing } from '../../hooks/useResponsiveScale';
import { useResponsive } from '../../hooks/useResponsive';

export interface BulletListItem {
  content: React.ReactNode;
}

export interface BulletListProps {
  items: BulletListItem[];
  bulletColor?: string;
  spacing?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
}

export function BulletList({ 
  items, 
  bulletColor = colors.brand?.soft || colors.accent.primary,
  spacing: itemSpacing = { xs: 8, sm: 10, md: 12, lg: 14, xl: 16 }
}: BulletListProps) {
  const { isSmall } = useResponsive();
  const { spacing } = useResponsiveSpacing();
  
  const gap = typeof itemSpacing === 'number' 
    ? spacing(itemSpacing)
    : spacing(itemSpacing[isSmall ? 'xs' : 'md'] || 12);
  
  const bulletSize = isSmall ? 4 : 6;
  const bulletMarginTop = isSmall ? 6 : 8;
  
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
              width: `${bulletSize}px`, 
              height: `${bulletSize}px`, 
              borderRadius: '50%', 
              backgroundColor: bulletColor, 
              marginTop: `${bulletMarginTop}px`, 
              flexShrink: 0 
            }} 
          />
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
