/**
 * @file ServerGroup.tsx
 * @description Componente reutilizable para grupos de servidores - Diseño elegante y profesional
 */

import { ChevronDown } from 'lucide-react';
import { ConfigItem } from '../../../../types/config';
import { Card } from '../../../ui/Card';
import { Text } from '../../../ui/Text';
import { ServerItem } from './ServerItem';
import { colors } from '../../../../constants/theme';

export interface ServerGroupProps {
  title: string;
  description?: string;
  items: ConfigItem[];
  isExpanded: boolean;
  onToggle: () => void;
  isPrimary?: boolean;
  isCollapsible?: boolean;
  showDescriptions?: boolean;
  // Props del ServerItem
  activeConfigId?: number;
  pendingConfigId?: number | null;
  onServerSelect: (config: ConfigItem) => void;
  getProtocol?: (mode: string) => string;
  getStatusInfo?: (name?: string, description?: string) => { label: string; dotClass: string };
  // Navegación remota
  onRegisterFocusable?: (el: HTMLElement | null, meta: { index: number; col: number; row: number; role?: string }) => void;
  baseIndex?: number;
  baseCol?: number;
  baseRow?: number;
  navActive?: boolean;
  focusedIndex?: number;
  // TV Mode
  isTvMode?: boolean;
}

export function ServerGroup({
  title,
  description,
  items,
  isExpanded,
  onToggle,
  isPrimary = false,
  isCollapsible = true,
  showDescriptions = true,
  activeConfigId,
  pendingConfigId,
  onServerSelect,
  getProtocol,
  getStatusInfo,
  onRegisterFocusable,
  baseIndex = 0,
  baseCol = 1,
  baseRow = 2,
  navActive = false,
  focusedIndex,
  isTvMode = false
}: ServerGroupProps) {
  const panelId = `group-panel-${title.toLowerCase().replace(/\s+/g, '-')}`;
  let localIndex = 0;

  return (
    <Card 
      className="overflow-hidden"
      style={{
        backgroundColor: isPrimary ? `${colors.brand.primary}08` : colors.background.secondary,
        borderColor: isPrimary ? colors.brand.primary : colors.border.secondary,
        borderWidth: isPrimary ? '1.5px' : '1px',
        borderRadius: isPrimary ? '20px' : '12px',
        boxShadow: isPrimary 
          ? `0 8px 32px ${colors.brand.primary}20, 0 0 1px ${colors.brand.primary}40` 
          : (isTvMode ? 'none' : undefined),
        background: isPrimary 
          ? `linear-gradient(135deg, ${colors.brand.primary}12 0%, ${colors.brand.primary}06 100%)`
          : colors.background.secondary
      }}
    >
      {/* Header del grupo */}
      <div
        className={`w-full flex items-center justify-between gap-3 text-left ${
          isTvMode ? 'px-2 py-1.5' : isPrimary ? 'px-5 py-5' : 'px-3 py-3'
        } ${
          isCollapsible ? 'cursor-pointer' : 'cursor-default'
        } ${navActive && focusedIndex === baseIndex ? 'ring-2 ring-brand/70' : ''}`}
        style={{ 
          backgroundColor: (isPrimary && !isTvMode) ? `linear-gradient(90deg, ${colors.brand.primary}10 0%, ${colors.brand.primary}05 100%)` : 'transparent',
          borderBottom: isExpanded ? `1.5px solid ${colors.border.secondary}` : 'none',
          transition: 'background-color 220ms ease'
        }}
        onClick={isCollapsible ? onToggle : undefined}
        role={isCollapsible ? "button" : "heading"}
        aria-expanded={isCollapsible ? isExpanded : undefined}
        aria-controls={isCollapsible ? panelId : undefined}
        tabIndex={isCollapsible ? 0 : -1}
        data-role="server-group-header"
        ref={(el) => onRegisterFocusable?.(el as HTMLElement, { index: baseIndex, col: baseCol, row: baseRow, role: 'server-group-header' })}
      >
        <div className="flex-1 min-w-0">
          <div className={`flex items-center gap-2 ${isTvMode ? 'mb-0' : isPrimary ? 'mb-2' : 'mb-1'}`}>
            <Text 
              variant="body" 
              color="primary" 
              className={`font-semibold ${isPrimary ? 'text-brand' : ''}`}
              style={{ fontSize: isTvMode ? '12px' : isPrimary ? '18px' : '15px', lineHeight: isTvMode ? '16px' : isPrimary ? '26px' : '22px', letterSpacing: isPrimary ? '-0.5px' : '0px' }}
            >
              {title}
            </Text>
          </div>
          
          {showDescriptions && description && (
            <Text 
              variant="bodySmall" 
              color="tertiary" 
              className={isTvMode ? "text-[10px]" : isPrimary ? "text-sm" : "text-xs"}
              style={{ lineHeight: isTvMode ? '14px' : isPrimary ? '20px' : '18px' }}
            >
              {description}
            </Text>
          )}
        </div>
        
        <div className="flex items-center gap-3 flex-shrink-0">
          <span 
            className={`rounded-full font-medium ${isTvMode ? 'px-1 py-0 text-[8px]' : isPrimary ? 'px-3.5 py-1.5 text-xs' : 'px-2 py-0.5 text-[10px]'}`}
            style={{
              backgroundColor: isPrimary ? `${colors.brand.primary}25` : colors.background.tertiary,
              color: isPrimary ? colors.brand.primary : colors.text.tertiary,
              fontSize: isTvMode ? '8px' : isPrimary ? '12px' : '10px',
              letterSpacing: isPrimary ? '0.12em' : '0.08em',
              textTransform: 'uppercase',
              fontWeight: isPrimary ? 700 : 500
            }}
          >
            {items.length}
          </span>
          
          {isCollapsible && (
            <ChevronDown 
              className={`w-5 h-5 transition-transform duration-300 ${
                isExpanded ? 'rotate-180' : 'rotate-0'
              } ${isPrimary ? 'text-brand' : ''}`}
              style={{ color: isPrimary ? colors.brand.primary : colors.text.tertiary }}
            />
          )}
        </div>
      </div>

      {/* Contenido expandible */}
      {isExpanded && (
        <div 
          id={panelId} 
          className={isTvMode ? "border-t px-2 py-1.5" : "border-t px-4 py-3"}
          style={{ borderColor: colors.border.primary }}
        >
          <div className={isTvMode ? "space-y-1" : "space-y-2"}>
            {items.map((config) => {
              localIndex += 1; // comienza en 1
              const absoluteIndex = (baseIndex || 0) + localIndex; // item n => baseIndex + n
              return (
                <ServerItem
                  key={config.id}
                  config={config}
                  isActive={String(activeConfigId) === String(config.id)}
                  isPending={pendingConfigId === config.id}
                  onSelect={onServerSelect}
                  getProtocol={getProtocol}
                  getStatusInfo={getStatusInfo}
                  onRegisterFocusable={onRegisterFocusable}
                  focusMeta={{ index: absoluteIndex, col: baseCol ?? 1, row: baseRow + localIndex, role: 'server-item' }}
                  navActive={navActive}
                  focusedIndex={focusedIndex}
                  showDescriptions={showDescriptions}
                />
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
