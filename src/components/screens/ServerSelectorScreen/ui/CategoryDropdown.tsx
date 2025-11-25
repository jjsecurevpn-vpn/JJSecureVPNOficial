/**
 * @file CategoryDropdown.tsx
 * @description Desplegable de categorías que muestra solo el nombre de la categoría seleccionada
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { ConfigCategory } from '../../../../types/config';
import { Text } from '../../../ui/Text';
import { colors } from '../../../../constants/theme';
import { getCleanCategoryName, getCategoryType, getCategoryTypeStyles, formatServerCountLabel } from '../utils/categoryUtils';
import { useTranslations } from '../../../../context/LanguageContext';

export interface CategoryDropdownProps {
  selectedCategory: ConfigCategory | null;
  categories: ConfigCategory[];
  onSelectCategory: (category: ConfigCategory) => void;
  activeConfigName?: string;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  selectedCategory,
  categories,
  onSelectCategory,
  activeConfigName
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();

  // Cerrar el dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelectCategory = (category: ConfigCategory) => {
    onSelectCategory(category);
    setIsOpen(false);
  };

  if (!selectedCategory) return null;

  const cleanName = getCleanCategoryName(selectedCategory.name);
  const categoryType = getCategoryType(selectedCategory);
  const typeStyles = getCategoryTypeStyles(categoryType, t);
  const serverCountLabel = formatServerCountLabel(
    t.serverSelectorScreen.categoryView.serverCount,
    selectedCategory.items.length
  );

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-lg flex items-center justify-between gap-3 transition-all duration-200"
        style={{
          backgroundColor: colors.background.secondary,
          border: `1px solid ${colors.border.primary}`,
          color: colors.text.primary
        }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-1 text-left">
            <Text
              variant="body"
              color="primary"
              className="font-medium truncate"
              style={{ fontSize: '15px', lineHeight: '22px' }}
            >
              {cleanName}
            </Text>
            <Text 
              variant="bodySmall" 
              color="tertiary" 
              className="text-xs truncate"
              style={{ lineHeight: '18px' }}
            >
              {activeConfigName ? `${activeConfigName} • ${serverCountLabel}` : serverCountLabel}
            </Text>
          </div>
        </div>

        {typeStyles && (
          <span
            className="uppercase font-semibold flex-shrink-0"
            style={{
              color: typeStyles.badge.color,
              fontSize: '10px',
              letterSpacing: '0.12em'
            }}
          >
            {typeStyles.badge.text}
          </span>
        )}

        <ChevronDown
          className="w-5 h-5 flex-shrink-0 transition-transform duration-200"
          style={{
            color: colors.text.tertiary,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-lg z-50 overflow-hidden"
          style={{
            backgroundColor: colors.background.primary,
            border: `1px solid ${colors.border.primary}`,
            maxHeight: '360px',
            overflowY: 'auto'
          }}
        >
          {categories.map((category) => {
            const isSelected = category.id === selectedCategory.id;
            const cleanCategoryName = getCleanCategoryName(category.name);
            const catType = getCategoryType(category);
            const catTypeStyles = getCategoryTypeStyles(catType, t);
            const catServerCount = formatServerCountLabel(
              t.serverSelectorScreen.categoryView.serverCount,
              category.items.length
            );

            return (
              <button
                key={category.id}
                onClick={() => handleSelectCategory(category)}
                className="w-full px-4 py-3 text-left transition-colors duration-150 border-b last:border-b-0 flex items-center justify-between gap-3 hover:bg-opacity-50"
                style={{
                  backgroundColor: isSelected ? colors.brand.primary + '15' : 'transparent',
                  borderBottomColor: colors.border.primary,
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = colors.states.hover.surfaceHover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Text
                      variant="body"
                      color="primary"
                      className="font-medium truncate"
                      style={{ fontSize: '14px', lineHeight: '20px' }}
                    >
                      {cleanCategoryName}
                    </Text>
                    {isSelected && (
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: colors.brand.primary }}
                      />
                    )}
                  </div>
                  <Text 
                    variant="bodySmall" 
                    color="tertiary" 
                    className="text-xs truncate"
                    style={{ lineHeight: '18px' }}
                  >
                    {catServerCount}
                  </Text>
                </div>

                {catTypeStyles && (
                  <span
                    className="uppercase font-semibold flex-shrink-0"
                    style={{
                      color: catTypeStyles.badge.color,
                      fontSize: '9px',
                      letterSpacing: '0.1em'
                    }}
                  >
                    {catTypeStyles.badge.text}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
