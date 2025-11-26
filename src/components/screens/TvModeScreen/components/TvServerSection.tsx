import React from 'react';
import { useTranslations } from '../../../../hooks/useTranslations';
import { ServerView } from '../../ServerSelectorScreen/components/ServerView';
import { StepSection } from './StepSection';
import type { Group } from '../../ServerSelectorScreen/types';
import type { ConfigItem } from '../../../../types/config';

interface TvServerSectionProps {
  loading: boolean;
  loadError: string | null;
  selectedCategory: Record<string, unknown>;
  compact: boolean;
  headerSize: 'small' | 'medium' | 'large';
  padding: number;
  fontSize: 'small' | 'base' | 'large';
  highlightStep2: boolean;
  query: string;
  setQuery: (query: string) => void;
  groupedItems: Group<ConfigItem>[];
  activeConfig: ConfigItem | null;
  pendingConfigId: string | number | null;
  toggleGroup: (category: string) => void;
  isGroupExpanded: (category: string) => boolean;
  handleConfigSelect: (config: ConfigItem) => void;
}

export const TvServerSection: React.FC<TvServerSectionProps> = ({
  loading,
  loadError,
  selectedCategory,
  compact,
  headerSize,
  padding,
  fontSize,
  highlightStep2,
  query,
  setQuery,
  groupedItems,
  activeConfig,
  pendingConfigId,
  toggleGroup,
  isGroupExpanded,
  handleConfigSelect,
}) => {
  const { t } = useTranslations();

  const getFontSizeClass = () => {
    if (compact) return 'text-xs';
    if (fontSize === 'small') return 'text-sm';
    if (fontSize === 'large') return 'text-lg';
    return 'text-base';
  };

  return (
    <StepSection
      title={t.tvMode?.steps?.selectServer || 'ELEGIR SERVIDOR'}
      headerSize={headerSize}
      compact={compact}
      padding={padding}
      className={`${highlightStep2 ? 'ring-2 ring-emerald-400/70 shadow-[0_0_0_1px_rgba(72,231,164,0.45)] animate-pulse' : ''}`}
      showScrollButtons={true}
    >
      <div className={`${compact ? 'text-xs' : 'text-sm'} scrollbar-hidden`}>
        {loading ? (
          <p className={`opacity-70 text-center ${getFontSizeClass()}`}>
            {(t.common?.loading || 'Cargando') + ' servidores...'}
          </p>
        ) : loadError ? (
          <p className={`text-red-500 text-center ${getFontSizeClass()}`}>
            {loadError}
          </p>
        ) : !selectedCategory ? (
          <p className={`opacity-70 text-center ${getFontSizeClass()}`}>
            {t.tvMode?.emptyCategory || 'Selecciona una categoría para ver servidores'}
          </p>
        ) : (
          <div className={compact ? 'server-list-compact' : ''}>
            <ServerView
              query={query}
              setQuery={setQuery}
              groupedItems={groupedItems}
              activeConfig={activeConfig}
              pendingConfigId={typeof pendingConfigId === 'string' ? parseInt(pendingConfigId) : pendingConfigId}
              toggleGroup={toggleGroup}
              isGroupExpanded={isGroupExpanded}
              handleConfigSelect={handleConfigSelect}
              isTv={true}
              compact={compact}
              fontSize={fontSize}
            />
          </div>
        )}
      </div>
    </StepSection>
  );
};
