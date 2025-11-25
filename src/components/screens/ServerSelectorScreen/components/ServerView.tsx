/**
 * @file ServerView.tsx
 * @description Vista de servidores para ServerSelectorScreen - Diseño elegante y profesional
 */

import React, { useRef, useEffect } from "react";
import { SearchInput, ServerGroup } from "../ui";
import { 
  getProtocol, 
  getStatusInfo 
} from "../../../../utils/serverUtils";
import { ServerViewProps } from "../types";
import { useTranslations } from "../../../../context/LanguageContext";

export const ServerView: React.FC<ServerViewProps> = ({
  query,
  setQuery,
  groupedItems,
  activeConfig,
  pendingConfigId,
  toggleGroup,
  isGroupExpanded,
  handleConfigSelect,
  showSearchInput = true,
  showDescriptions = true,
  isTv = false,
  // Props de navegación por control remoto eliminadas
}) => {
  const t = useTranslations();
  const globalIndexCounter = useRef(0);
  useEffect(() => { globalIndexCounter.current = 0; }, [groupedItems, query]);
  
  return (
    <div>
      {/* Buscador de servidores */}
      {showSearchInput && (
        <div className={isTv ? "mb-2 rounded-md" : "mb-6 rounded-md"}>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder={t.serverSelectorScreen.searchBar.placeholder}
            isTv={isTv}
          />
        </div>
      )}

      <div className={isTv ? "space-y-2" : "space-y-4"}>
        {groupedItems.map((group, gIndex) => (
          <ServerGroup
            key={group.key}
            title={group.title}
            description={group.description}
            items={group.items}
            isExpanded={isGroupExpanded(group.key)}
            onToggle={() => toggleGroup(group.key)}
            isPrimary={gIndex === 0}
            isCollapsible={true}
            activeConfigId={activeConfig?.id}
            pendingConfigId={pendingConfigId}
            onServerSelect={handleConfigSelect}
            getProtocol={getProtocol}
            getStatusInfo={getStatusInfo}
            isTvMode={isTv}
            showDescriptions={showDescriptions}
          />
        ))}
      </div>
    </div>
  );
};
