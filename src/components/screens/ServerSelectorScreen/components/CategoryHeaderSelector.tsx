/**
 * @file CategoryHeaderSelector.tsx
 * @description Selector de categorías siempre visible dentro del header
 */

import React, { useState, useRef } from "react";
import { Search, X } from "lucide-react";
import { ConfigCategory } from "../../../../types/config";
import { Text } from "../../../ui/Text";
import { colors } from "../../../../constants/theme";
import { Spinner } from "../../../ui/Spinner";
import {
  getCleanCategoryName,
  getCategoryType,
  getCategoryTypeStyles,
} from "../utils/categoryUtils";
import { useTranslations } from "../../../../context/LanguageContext";
import { useEffect } from "react";

interface CategoryHeaderSelectorProps {
  categories: ConfigCategory[];
  selectedCategory: ConfigCategory | null;
  onSelect: (category: ConfigCategory) => void;
  instructions: {
    title: string;
    subtitle?: string;
    helper?: string;
  };
  summary?: string | null;
  loadingCategoryId?: number | null;
  onSearchQueryChange?: (query: string) => void;
  onSearchVisibilityChange?: (visible: boolean) => void;
  isHeaderScrolled?: boolean;
}

export const CategoryHeaderSelector: React.FC<CategoryHeaderSelectorProps> = ({
  categories,
  selectedCategory,
  onSelect,
  instructions,
  summary,
  loadingCategoryId,
  onSearchQueryChange,
  onSearchVisibilityChange,
  isHeaderScrolled = false,
}) => {
  const t = useTranslations();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const categoriesContainerRef = useRef<HTMLDivElement>(null);

  const handleSearchToggle = () => {
    const nextShow = !showSearch;
    setShowSearch(nextShow);
    onSearchVisibilityChange?.(nextShow);

    if (nextShow) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    } else {
      setSearchQuery("");
      onSearchQueryChange?.("");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchQueryChange?.(value);
  };

  // Centrar categoría seleccionada cuando cambia
  useEffect(() => {
    if (!showSearch && selectedCategory && categoriesContainerRef.current) {
      const container = categoriesContainerRef.current;
      const selectedButton = container.querySelector(`button[data-category-id="${selectedCategory.id}"]`);
      
      if (selectedButton) {
        const containerWidth = container.offsetWidth;
        const buttonLeft = (selectedButton as HTMLElement).offsetLeft;
        const buttonWidth = (selectedButton as HTMLElement).offsetWidth;
        
        // Calcular posición para centrar el botón
        const centerPosition = buttonLeft + buttonWidth / 2 - containerWidth / 2;
        
        container.scrollTo({
          left: Math.max(0, centerPosition),
          behavior: 'smooth'
        });
      }
    }
  }, [selectedCategory, showSearch]);

  if (!categories.length) {
    return null;
  }

  const showSummary = selectedCategory && summary;

  const titleVariant = isHeaderScrolled ? "h3" : "h2";
  const titleClass = "font-semibold tracking-wide";
  const titleTransform = isHeaderScrolled ? "scale(0.92)" : "scale(1)";
  const titleOpacity = isHeaderScrolled ? 0.78 : 1;
  const controlsVisible = !isHeaderScrolled && !showSearch;
  const controlTransitionStyle = {
    opacity: controlsVisible ? 1 : 0,
    transform: controlsVisible ? "translateY(0)" : "translateY(-4px)",
    transition: "opacity 220ms ease, transform 220ms ease",
  } as React.CSSProperties;

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Top row: Title, Summary, and Search Icon / Input */}
      <div className="flex items-center justify-between gap-2">
        {showSearch ? (
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={t.serverSelectorScreen.searchBar.placeholder}
            autoComplete="off"
            className="flex-1 px-3 py-2 rounded-lg text-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition"
          />
        ) : (
          <Text
            variant={titleVariant}
            color="primary"
            className={titleClass}
            style={{
              transform: titleTransform,
              opacity: titleOpacity,
              transition: "transform 220ms ease, opacity 220ms ease",
            }}
          >
            {instructions.title}
          </Text>
        )}
        <div className="flex items-center gap-2 flex-shrink-0">
          {!showSearch && !isHeaderScrolled && showSummary && (
            <span
              className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-white/90 whitespace-nowrap"
              style={controlTransitionStyle}
            >
              {summary}
            </span>
          )}
          <button
            type="button"
            onClick={handleSearchToggle}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white transition flex-shrink-0"
            aria-label={showSearch ? "Cerrar búsqueda" : "Buscar"}
            style={controlTransitionStyle}
          >
            {showSearch ? (
              <X className="w-5 h-5" strokeWidth={2} />
            ) : (
              <Search className="w-5 h-5" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
      
      {instructions.subtitle && !showSearch && (
        <Text variant="bodySmall" color="tertiary" className="text-xs">
          {instructions.subtitle}
        </Text>
      )}
      
      {/* Categories Row */}
      {!showSearch && (
        <div
          ref={categoriesContainerRef}
          className="flex gap-2 overflow-x-auto pb-1"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {categories.map((category) => {
            const isSelected = selectedCategory?.id === category.id;
            const isLoading = loadingCategoryId === category.id;
            const cleanName = getCleanCategoryName(category.name);
            const typeStyles = getCategoryTypeStyles(
              getCategoryType(category),
              t
            );

            return (
              <button
                key={category.id}
                data-category-id={category.id}
                onClick={() => onSelect(category)}
                className="px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-opacity duration-200"
                style={{
                  backgroundColor: isSelected
                    ? colors.brand.primary
                    : colors.background.secondary,
                  color: isSelected ? "#ffffff" : colors.text.secondary,
                  borderColor: isSelected
                    ? colors.brand.primary
                    : colors.border.primary,
                  opacity: isLoading ? 0.7 : 1,
                }}
                disabled={isLoading}
              >
                <span>{cleanName}</span>
                {typeStyles && (
                  <span
                    className="uppercase text-[10px] tracking-[0.12em]"
                    style={{ color: isSelected ? "#ffffff" : typeStyles.badge.color }}
                  >
                    {typeStyles.badge.text}
                  </span>
                )}
                {isLoading && <Spinner size="sm" color="neutral" inline />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
