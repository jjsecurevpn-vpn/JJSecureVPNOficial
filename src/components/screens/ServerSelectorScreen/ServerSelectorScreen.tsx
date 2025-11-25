/**
 * @file ServerSelectorScreen.tsx
 * @description Pantalla de selección de servidores refactorizada con ScreenLayout
 */

import React, { useState } from "react";
import { ScreenLayout } from "../../layouts";

import { ServerView } from "./components/ServerView";
import { LoadingView } from "./components/LoadingView";
import { ErrorView } from "./components/ErrorView";
import { EmptyState } from "./ui/EmptyState";
import { CategoryHeaderSelector } from "./components/CategoryHeaderSelector";

import { useServerSelectorScreen } from "./hooks/useServerSelectorScreen";
import { formatServerCountLabel } from "./utils/categoryUtils";
import { Text } from "../../ui";
import { useTranslations } from "../../../context/LanguageContext";

interface ServerSelectorScreenFixedProps {
  onBack?: () => void;
}

export const ServerSelectorScreen: React.FC<ServerSelectorScreenFixedProps> = ({ onBack }) => {
  const {
    configs,
    loading,
    loadingCategoryId,
    query,
    setQuery,
    hasConfigs,
    activeConfig,
    selectedCategory,
    pendingConfigId,
    loadError,
    groupedItems,
    headerTitle,
    handleConfigSelect,
    handleCategorySelect,
    loadConfigs,
    openNativeSelector,
    toggleGroup,
    isGroupExpanded,
  } = useServerSelectorScreen();
  const t = useTranslations();
  const [isHeaderSearchActive, setHeaderSearchActive] = useState(false);
  const [showDescriptions] = useState(false);

  const showBackButton = !!onBack;
  const handleBackPress = () => {
    if (onBack) {
      onBack();
    }
  };
  const categorySummary = selectedCategory
    ? formatServerCountLabel(
        t.serverSelectorScreen.categoryView.serverCount,
        selectedCategory.items.length
      )
    : null;
  const flowGuide = t.serverSelectorScreen.flowGuide;

  return (
    <ScreenLayout
      title={headerTitle}
      showBackButton={showBackButton}
      onBackPress={handleBackPress}
      enableScrollEffect={true}
      horizontalPadding={12}
      verticalPadding={10}
      headerHeight={isHeaderSearchActive ? 118 : 130}
      headerContent={hasConfigs ? ({ isScrolled }) => (
        <CategoryHeaderSelector
          categories={configs}
          selectedCategory={selectedCategory}
          onSelect={handleCategorySelect}
          instructions={{
            title: t.serverSelectorScreen.header.categories,
          }}
          summary={categorySummary}
          loadingCategoryId={loadingCategoryId}
          onSearchQueryChange={setQuery}
          onSearchVisibilityChange={setHeaderSearchActive}
          isHeaderScrolled={isScrolled}
        />
      ) : undefined}
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
        ) : !hasConfigs ? (
          <EmptyState
            title={flowGuide.title}
            description={t.serverSelectorScreen.loadingView.noServersAvailable}
          />
        ) : !selectedCategory ? (
          <EmptyState
            title={flowGuide.title}
            description={flowGuide.helper}
          />
        ) : (
          <>
            <div className="rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-center">
              <Text variant="bodySmall" color="secondary" className="text-xs">
                {flowGuide.helper}
              </Text>
            </div>
            <ServerView
              query={query}
              setQuery={setQuery}
              groupedItems={groupedItems}
              activeConfig={activeConfig}
              pendingConfigId={pendingConfigId}
              toggleGroup={toggleGroup}
              isGroupExpanded={isGroupExpanded}
              handleConfigSelect={handleConfigSelect}
              showSearchInput={false}
              showDescriptions={showDescriptions}
            />
          </>
        )}
      </div>
    </ScreenLayout>
  );
};