/**
 * @file CategoryCard.tsx
 * @description Card reutilizable para mostrar categorías de servidores - Diseño simplificado
 */

import { useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import { ChevronRight } from 'lucide-react';
import { Spinner } from '../../../ui/Spinner';
import { ConfigCategory } from '../../../../types/config';
import { Card } from '../../../ui/Card';
import { Text } from '../../../ui/Text';
import { colors } from '../../../../constants/theme';
import { getCleanCategoryName, getCategoryType, getCategoryTypeStyles, formatServerCountLabel } from '../utils/categoryUtils';
import { useTranslations } from '../../../../context/LanguageContext';

export interface CategoryCardProps {
  category: ConfigCategory;
  containsActive: boolean;
  activeConfigName?: string;
  isLoading?: boolean;
  onSelect: (category: ConfigCategory) => void;
  normalizeColor?: (color: string) => string;
}

export function CategoryCard({ 
  category, 
  containsActive, 
  activeConfigName,
  isLoading = false,
  onSelect}: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations();
  
  const cleanName = getCleanCategoryName(category.name);
  const categoryType = useMemo(() => getCategoryType(category), [category]);
  const typeStyles = useMemo(() => getCategoryTypeStyles(categoryType, t), [categoryType, t]);
  const serverCountLabel = useMemo(() => {
    const template = t.serverSelectorScreen.categoryView.serverCount;
    return formatServerCountLabel(template, category.items.length);
  }, [category.items.length, t]);
  const baseBackground = typeStyles?.subtleBg ?? colors.background.secondary;
  const hoverBackground = typeStyles?.subtleBg ? typeStyles.subtleBg : colors.states.hover.surfaceHover;
  const borderColor = containsActive ? colors.brand.primary : colors.border.primary;

  const handleClick = () => {
    if (!isLoading) {
      onSelect(category);
    }
  };

  return (
    <Card
      variant="interactive"
      className="p-3 cursor-pointer transition-all duration-200 relative overflow-hidden"
      onClick={handleClick}
      onMouseEnter={(event: MouseEvent<HTMLDivElement>) => {
        setIsHovered(true);
        if (hoverBackground) {
          event.currentTarget.style.backgroundColor = hoverBackground;
        }
      }}
      onMouseLeave={(event: MouseEvent<HTMLDivElement>) => {
        setIsHovered(false);
        if (baseBackground) {
          event.currentTarget.style.backgroundColor = baseBackground;
        }
      }}
      style={{
        backgroundColor: isHovered ? hoverBackground : baseBackground,
        borderColor,
        borderWidth: '1px',
  borderLeftWidth: containsActive ? '3px' : '1px',
  borderLeftColor: containsActive ? colors.brand.primary : colors.border.primary,
        opacity: isLoading ? 0.7 : 1,
        boxShadow: isHovered ? '0 6px 18px rgba(0,0,0,0.18)' : 'none',
        transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Indicador de estado - solo para categoría activa */}
          {containsActive && (
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors.brand.primary }}
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Text
                variant="body"
                color="primary"
                className="font-medium truncate"
                style={{ fontSize: '15px', lineHeight: '22px' }}
              >
                {cleanName}
              </Text>
              {containsActive && (
                <span className="text-[11px] leading-none font-semibold tracking-wide px-2 py-1 rounded-full border border-brand/40 text-brand-100 bg-brand/10">
                  {t.serverSelectorScreen.categoryView.activeConfig}
                </span>
              )}
            </div>
            <Text variant="bodySmall" color="tertiary" className="text-xs" style={{ lineHeight: '18px' }}>
              {containsActive && activeConfigName ? (
                `${activeConfigName} • ${serverCountLabel}`
              ) : (
                serverCountLabel
              )}
            </Text>
          </div>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end justify-between gap-2">
          {typeStyles && (
            <span
              className="uppercase font-semibold"
              style={{
                color: typeStyles.badge.color,
                fontSize: '10px',
                letterSpacing: '0.12em'
              }}
            >
              {typeStyles.badge.text}
            </span>
          )}

          <div className="flex items-center justify-center">
            {isLoading ? (
              <Spinner size="md" color="neutral" inline />
            ) : (
              <ChevronRight className="w-4 h-4" style={{ color: colors.text.tertiary }} />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
