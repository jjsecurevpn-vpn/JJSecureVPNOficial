/**
 * @file CategoryView.tsx
 * @description Vista de categorías para ServerSelectorScreen
 */

import React from "react";
import { SearchInput, ActiveServerCard, CategoryCard } from "../ui";
import { CategoryViewProps } from "../types";
import { useTranslations } from "../../../../context/LanguageContext";

export const CategoryView: React.FC<CategoryViewProps> = ({
  activeConfig,
  activeCategory,
  query,
  setQuery,
  filteredCategories,
  loadingCategoryId,
  handleCategorySelect,
  normalizeColor
}) => {
  const t = useTranslations();
  return (
    <div>
      {activeConfig && (
        <ActiveServerCard 
          activeConfig={activeConfig}
          activeCategory={activeCategory}
        />
      )}

      {/* Buscador de categorías */}
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder={t.serverSelectorScreen.searchBar.placeholder}
        className="mb-3"
      />

      <div className="space-y-2.5">
        {filteredCategories.map((category) => {
          const containsActive = category.items.some((it) => it.id === activeConfig?.id);
          const isLoading = loadingCategoryId === category.id;
          return (
            <CategoryCard
              key={category.id}
              category={category}
              containsActive={containsActive}
              activeConfigName={activeConfig?.name}
              isLoading={isLoading}
              onSelect={handleCategorySelect}
              normalizeColor={normalizeColor}
            />
          );
        })}
      </div>
    </div>
  );
};
