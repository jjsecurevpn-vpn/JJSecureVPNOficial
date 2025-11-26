import React from 'react';
import { TvServerSection } from './TvServerSection';
import { TvCredentialsSection } from './TvCredentialsSection';
import { TvConnectionSection } from './TvConnectionSection';
import type { Group } from '../../ServerSelectorScreen/types';
import type { ConfigItem } from '../../../../types/config';

interface TvHorizontalLayoutProps {
  spacePx: (value: number) => number;
  responsiveLayout: Record<string, unknown>;
  highlightStep1: boolean;
  highlightStep2: boolean;
  loading: boolean;
  loadError: string | null;
  selectedCategory: Record<string, unknown>;
  contentJustifyClass: string;
  query: string;
  setQuery: (query: string) => void;
  groupedItems: Group<ConfigItem>[];
  ssActiveConfig: ConfigItem | null;
  pendingConfigId: string | number | null;
  toggleGroup: (category: string) => void;
  isGroupExpanded: (category: string) => boolean;
  handleConfigSelect: (config: ConfigItem) => void;
  activeConfig: ConfigItem | null;
  formError: string | null;
  vpn: Record<string, unknown>;
  handleConnection: () => Record<string, unknown>;
  showServerDescription: boolean;
}

export const TvHorizontalLayout: React.FC<TvHorizontalLayoutProps> = ({
  spacePx,
  responsiveLayout,
  highlightStep1,
  highlightStep2,
  loading,
  loadError,
  selectedCategory,
  contentJustifyClass,
  query,
  setQuery,
  groupedItems,
  ssActiveConfig,
  pendingConfigId,
  toggleGroup,
  isGroupExpanded,
  handleConfigSelect,
  activeConfig,
  formError,
  vpn,
  handleConnection,
  showServerDescription,
}) => {
  return (
    <>
      {/* PASO 2 - SERVIDOR (Columna Izquierda, prominente) */}
      <TvServerSection
        loading={loading}
        loadError={loadError}
        selectedCategory={selectedCategory}
        compact={Boolean(responsiveLayout.compact)}
        headerSize={responsiveLayout.headerSize as 'small' | 'medium' | 'large'}
        padding={spacePx(responsiveLayout.padding as number)}
        fontSize={responsiveLayout.fontSize as 'small' | 'base' | 'large'}
        highlightStep2={highlightStep2}
        query={query}
        setQuery={setQuery}
        groupedItems={groupedItems}
        activeConfig={ssActiveConfig}
        pendingConfigId={pendingConfigId}
        toggleGroup={toggleGroup}
        isGroupExpanded={isGroupExpanded}
        handleConfigSelect={handleConfigSelect}
      />

      {/* Columna Derecha - Credenciales y Conexión apiladas */}
      <div className="flex flex-col" style={{ gap: spacePx(responsiveLayout.spacing as number) }}>
        <TvCredentialsSection
          headerSize={responsiveLayout.headerSize as 'small' | 'medium' | 'large'}
          compact={Boolean(responsiveLayout.compact)}
          padding={spacePx(responsiveLayout.padding as number)}
          highlightStep1={highlightStep1}
        />

        <TvConnectionSection
          headerSize={responsiveLayout.headerSize as 'small' | 'medium' | 'large'}
          compact={Boolean(responsiveLayout.compact)}
          padding={spacePx(responsiveLayout.padding as number)}
          spacing={spacePx(responsiveLayout.spacing as number)}
          fontSize={responsiveLayout.fontSize as 'small' | 'base' | 'large'}
          contentJustifyClass={contentJustifyClass}
          activeConfig={activeConfig}
          formError={formError}
          vpn={vpn}
          onConnection={handleConnection}
          showServerDescription={showServerDescription}
        />
      </div>
    </>
  );
};
