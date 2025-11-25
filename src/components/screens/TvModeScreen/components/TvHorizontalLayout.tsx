import React from 'react';
import { TvServerSection } from './TvServerSection';
import { TvCredentialsSection } from './TvCredentialsSection';
import { TvConnectionSection } from './TvConnectionSection';

interface TvHorizontalLayoutProps {
  spacePx: (value: number) => number;
  responsiveLayout: any;
  highlightStep1: boolean;
  highlightStep2: boolean;
  loading: boolean;
  loadError: string | null;
  selectedCategory: any;
  contentJustifyClass: string;
  query: string;
  setQuery: (query: string) => void;
  groupedItems: any[];
  ssActiveConfig: any;
  pendingConfigId: string | number | null;
  toggleGroup: (category: string) => void;
  isGroupExpanded: (category: string) => boolean;
  handleConfigSelect: (config: any) => void;
  activeConfig: any;
  formError: string | null;
  vpn: any;
  handleConnection: () => any;
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
        compact={responsiveLayout.compact}
        headerSize={responsiveLayout.headerSize}
        padding={spacePx(responsiveLayout.padding)}
        fontSize={responsiveLayout.fontSize}
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
      <div className="flex flex-col" style={{ gap: spacePx(responsiveLayout.spacing) }}>
        <TvCredentialsSection
          headerSize={responsiveLayout.headerSize}
          compact={responsiveLayout.compact}
          padding={spacePx(responsiveLayout.padding)}
          highlightStep1={highlightStep1}
        />

        <TvConnectionSection
          headerSize={responsiveLayout.headerSize}
          compact={responsiveLayout.compact}
          padding={spacePx(responsiveLayout.padding)}
          spacing={spacePx(responsiveLayout.spacing)}
          fontSize={responsiveLayout.fontSize}
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
