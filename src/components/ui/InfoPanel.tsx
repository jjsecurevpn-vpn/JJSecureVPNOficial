/**
 * @file InfoPanel.tsx
 * @description Componente reutilizable para paneles informativos con icono y contenido
 */

import React from 'react';
import { Card, Text, Stack } from './';
import { colors, spacing, borderRadius } from '../../constants/theme';
import { useResponsive } from '../../hooks/useResponsive';

export interface InfoPanelProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error';
}

export function InfoPanel({ 
  title, 
  subtitle, 
  icon, 
  children,
  variant = 'default' 
}: InfoPanelProps) {
  const { isSmall } = useResponsive();
  
  const getVariantColors = () => {
    switch (variant) {
      case 'info':
        return {
          background: `${colors.brand.primary}10`,
          border: `${colors.brand.primary}20`,
          iconBg: `${colors.brand.primary}20`,
          iconColor: colors.brand.soft
        };
      case 'success':
        return {
          background: `${colors.status.success}10`,
          border: `${colors.status.success}20`,
          iconBg: `${colors.status.success}20`,
          iconColor: colors.status.success
        };
      case 'warning':
        return {
          background: `${colors.status.warning}10`,
          border: `${colors.status.warning}20`,
          iconBg: `${colors.status.warning}20`,
          iconColor: colors.status.warning
        };
      case 'error':
        return {
          background: `${colors.status.error}10`,
          border: `${colors.status.error}20`,
          iconBg: `${colors.status.error}20`,
          iconColor: colors.status.error
        };
      default:
        return {
          background: colors.background.secondary,
          border: colors.border.primary,
          iconBg: `${colors.brand.primary}20`,
          iconColor: colors.brand.primary
        };
    }
  };

  const variantColors = getVariantColors();
  const iconSize = isSmall ? '40px' : '48px';
  const iconInnerSize = isSmall ? '20px' : '24px';

  return (
    <Card 
      style={{ 
        backgroundColor: variantColors.background,
        borderColor: variantColors.border,
        padding: isSmall ? spacing.lg : spacing['2xl'],
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        boxShadow: 'none'
      }}
    >
      <Stack spacing={16}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start',
          gap: isSmall ? spacing.md : spacing.lg,
          flexWrap: 'wrap'
        }}>
          <div 
            style={{ 
              width: iconSize,
              height: iconSize,
              borderRadius: borderRadius.lg,
              backgroundColor: variantColors.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <div 
              style={{ 
                width: iconInnerSize,
                height: iconInnerSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: variantColors.iconColor
              }}
            >
              {icon}
            </div>
          </div>
          <div style={{ 
            flex: 1, 
            minWidth: 0, // Permite que el contenido se contraiga
            maxWidth: '100%'
          }}>
            <Stack spacing={8}>
              <Text 
                variant={isSmall ? "h3" : "h2"} 
                color="primary" 
                style={{ 
                  wordBreak: 'break-word',
                  lineHeight: '1.3',
                  margin: 0
                }}
              >
                {title}
              </Text>
              {subtitle && (
                <Text 
                  variant={isSmall ? "bodySmall" : "body"} 
                  color="tertiary" 
                  style={{ 
                    wordBreak: 'break-word',
                    lineHeight: '1.4',
                    margin: 0
                  }}
                >
                  {subtitle}
                </Text>
              )}
            </Stack>
          </div>
        </div>
        
        {children && (
          <div style={{ 
            width: '100%',
            minWidth: 0,
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}>
            {children}
          </div>
        )}
      </Stack>
    </Card>
  );
}
