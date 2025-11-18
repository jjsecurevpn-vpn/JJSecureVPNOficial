/**
 * @file ServerSelectorScreen.tsx
 * @description Pantalla de selección de servidores refactorizada con ScreenLayout
 */

import React from "react";
import { ScreenLayout } from "../../layouts";

import { CategoryView } from "./components/CategoryView";
import { ServerView } from "./components/ServerView";
import { LoadingView } from "./components/LoadingView";
import { ErrorView } from "./components/ErrorView";

import { useServerSelectorScreen } from "./hooks/useServerSelectorScreen";
import { normalizeColor } from "./utils/serverUtils";
import { formatServerCountLabel } from "./utils/categoryUtils";
import { Text } from "../../ui/Text";
import { useTranslations } from "../../../context/LanguageContext";

interface ServerSelectorScreenFixedProps {
  onBack?: () => void;
}

export const ServerSelectorScreen: React.FC<ServerSelectorScreenFixedProps> = ({ onBack }) => {
  const {
    loading,
    loadingCategoryId,
    query,
    setQuery,
    hasConfigs,
    activeConfig,
    selectedCategory,
    pendingConfigId,
    loadError,
    filteredCategories,
    groupedItems,
    headerTitle,
    cleanSelectedCategoryName,
    selectedCategoryStyles,
    handleConfigSelect,
    handleCategorySelect,
    loadConfigs,
    openNativeSelector,
    setSelectedCategory,
    toggleGroup,
    isGroupExpanded,
  } = useServerSelectorScreen();
  const t = useTranslations();

  const handleBackToCategories = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  const showBackButton = selectedCategory !== null || !!onBack;
  const handleBackPress = () => {
    if (selectedCategory !== null) {
      handleBackToCategories();
    } else if (onBack) {
      onBack();
    }
  };
  const categorySummary = selectedCategory
    ? formatServerCountLabel(
        t.serverSelectorScreen.categoryView.serverCount,
        selectedCategory.items.length
      )
    : null;

  const headerContent = selectedCategory ? (
    <div className="flex flex-col items-center gap-1 text-center">
      <div className="flex items-center gap-3">
        <Text
          variant="h2"
          color="primary"
          className="font-semibold"
          as="h1"
        >
          {cleanSelectedCategoryName ?? selectedCategory.name}
        </Text>
        {selectedCategoryStyles && (
          <span
            className="uppercase font-semibold"
            style={{
              color: selectedCategoryStyles.badge.color,
              fontSize: '11px',
              letterSpacing: '0.14em'
            }}
          >
            {selectedCategoryStyles.badge.text}
          </span>
        )}
      </div>
      {categorySummary && (
        <Text variant="bodySmall" color="tertiary" className="uppercase tracking-[0.08em] text-xs">
          {categorySummary}
        </Text>
      )}
    </div>
  ) : undefined;

  return (
    <ScreenLayout
      title={headerTitle}
      showBackButton={showBackButton}
      onBackPress={handleBackPress}
  enableScrollEffect={true}
  horizontalPadding={12}
  verticalPadding={10}
      headerContent={headerContent}
    >
  <div className="space-y-3">
        {/* Prioridad: 1) Loading 2) Error 3) Contenido */}
        {loading ? (
          <LoadingView 
            loading={loading}
            hasConfigs={hasConfigs}
            handleUpdate={loadConfigs}
          />
        ) : loadError ? (
          <ErrorView 
            error={loadError}
            onRetry={loadConfigs}
            onUseNative={openNativeSelector}
          />
        ) : selectedCategory === null ? (
          <CategoryView
            activeConfig={activeConfig}
            activeCategory={selectedCategory}
            query={query}
            setQuery={setQuery}
            filteredCategories={filteredCategories}
            handleCategorySelect={handleCategorySelect}
            normalizeColor={normalizeColor}
            loadingCategoryId={loadingCategoryId}
          />
        ) : (
          <ServerView
            query={query}
            setQuery={setQuery}
            groupedItems={groupedItems}
            activeConfig={activeConfig}
            pendingConfigId={pendingConfigId}
            toggleGroup={toggleGroup}
            isGroupExpanded={isGroupExpanded}
            handleConfigSelect={handleConfigSelect}
          />
        )}
      </div>
    </ScreenLayout>
  );
};