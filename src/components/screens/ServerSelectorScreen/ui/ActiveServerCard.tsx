/**
 * @file ActiveServerCard.tsx
 * @description Card que muestra el servidor actualmente conectado - Diseño elegante y profesional
 */

import { Server, Wifi } from 'lucide-react';
import { ConfigItem, ConfigCategory } from '../../../../types/config';
import { Card } from '../../../ui/Card';
import { Text } from '../../../ui/Text';
import { colors } from '../../../../constants/theme';
import { getCleanCategoryName, getCategoryType, getCategoryTypeStyles } from '../utils/categoryUtils';
import { useTranslations } from '../../../../context/LanguageContext';

export interface ActiveServerCardProps {
  activeConfig: ConfigItem;
  activeCategory?: ConfigCategory | null;
}

export function ActiveServerCard({ activeConfig, activeCategory }: ActiveServerCardProps) {
  const cleanCategoryName = activeCategory ? getCleanCategoryName(activeCategory.name) : '';
  const t = useTranslations();
  const categoryType = activeCategory ? getCategoryType(activeCategory) : 'other';
  const categoryStyles = activeCategory ? getCategoryTypeStyles(categoryType, t) : null;
  
  const getProtocolName = (mode: string) => {
    const modeType = mode.toLowerCase();
    if (modeType.includes('v2ray')) return 'V2Ray';
    if (modeType.includes('ssh')) return 'SSH';
    if (modeType.includes('ssl')) return 'SSL';
    if (modeType.includes('slowdns')) return 'SlowDNS';
    if (modeType.includes('udp')) return 'UDP';
    return mode.toUpperCase();
  };

  return (
    <Card 
      className="mb-4 p-3"
      style={{ 
        backgroundColor: categoryStyles?.subtleBg ?? `${colors.brand.primary}08`,
        borderColor: colors.border.primary,
        borderWidth: '1px'
      }}
    >
      {/* Header con estado */}
      <div className="flex items-center justify-between mb-2 gap-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: colors.brand.primary }} 
          />
          <Text 
            variant="bodySmall" 
            className="uppercase tracking-wide font-medium text-xs"
            style={{ 
              color: colors.brand.primary,
              letterSpacing: '0.5px'
            }}
          >
            {t.serverSelectorScreen.serverCard.connected}
          </Text>
        </div>

        {categoryStyles && (
          <span
            className="uppercase font-semibold"
            style={{
              color: categoryStyles.badge.color,
              fontSize: '10px',
              letterSpacing: '0.12em'
            }}
          >
            {categoryStyles.badge.text}
          </span>
        )}
      </div>
      
      {/* Información principal del servidor */}
      <div className="flex items-center gap-3">
        <div 
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ 
            backgroundColor: colors.background.tertiary
          }}
        >
          {activeConfig.icon ? (
            <img src={activeConfig.icon} alt="" className="w-6 h-6 object-cover rounded" />
          ) : (
            <Server className="w-5 h-5" style={{ color: colors.text.tertiary }} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <Text
            variant="body"
            color="primary"
            className="font-semibold mb-1 truncate"
            style={{ fontSize: '15px', lineHeight: '22px' }}
          >
            {activeConfig.name}
          </Text>
          
          <div className="flex items-center gap-2 text-xs" style={{ color: colors.text.tertiary }}>
            <Text variant="bodySmall" color="tertiary" className="truncate">
              {cleanCategoryName}
            </Text>
            
            <div className="flex items-center gap-1">
              <Wifi className="w-3 h-3" style={{ color: colors.text.tertiary }} />
              <span 
                className="px-2 py-0.5 text-[10px] rounded font-medium"
                style={{
                  backgroundColor: colors.background.tertiary,
                  color: colors.text.tertiary,
                  fontSize: '10px'
                }}
              >
                {getProtocolName(activeConfig.mode)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
