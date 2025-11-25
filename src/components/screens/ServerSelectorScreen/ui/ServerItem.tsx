/**
 * @file ServerItem.tsx
 * @description Componente reutilizable para mostrar items de servidor - Diseño elegante y profesional
 */

import { Check, Server, ChevronDown, ChevronUp } from 'lucide-react';
import { Spinner } from '../../../ui/Spinner';
import { ConfigItem } from '../../../../types/config';
import { Card } from '../../../ui/Card';
import { Text } from '../../../ui/Text';
import { colors } from '../../../../constants/theme';
import { useState, useEffect } from 'react';
import { useTranslations } from '../../../../context/LanguageContext';

export interface ServerItemProps {
  config: ConfigItem;
  isActive?: boolean;
  isPending?: boolean;
  onSelect: (config: ConfigItem) => void;
  getProtocol?: (mode: string) => string;
  getStatusInfo?: (name?: string, description?: string) => { label: string; dotClass: string };
  onRegisterFocusable?: (el: HTMLElement | null, meta: { index: number; col: number; row: number; role?: string }) => void;
  focusMeta?: { index: number; col: number; row: number; role?: string };
  navActive?: boolean;
  focusedIndex?: number;
  showDescriptions?: boolean;
}

export function ServerItem({
  config,
  isActive = false,
  isPending = false,
  onSelect,
  getProtocol = (mode) => mode?.toUpperCase?.() || '',
  getStatusInfo,
  onRegisterFocusable,
  focusMeta,
  navActive = false,
  focusedIndex,
  showDescriptions = true,
}: ServerItemProps) {
  const [isDescriptionOpen, setDescriptionOpen] = useState(showDescriptions);
  const t = useTranslations();
  // Detectar TV
  const isTv = typeof window !== 'undefined' && window.innerWidth >= 1024;
  const statusInfo = getStatusInfo?.(config.name, config.description) || { label: t.serverSelectorScreen.serverCard.select, dotClass: 'bg-slate-400' };
  const baseBackground = isActive ? `${colors.brand.primary}15` : colors.background.secondary;
  const protocolLabel = getProtocol(config.mode);
  const hasDescription = Boolean(config.description);

  useEffect(() => {
    setDescriptionOpen(showDescriptions);
  }, [showDescriptions]);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button[data-description-toggle]') || target.closest('[data-description-content]')) {
      return;
    }
    if (!isPending) {
      onSelect(config);
    }
  };

  return (
    <Card
      variant={isActive ? 'selected' : 'interactive'}
      className={`cursor-pointer transition-all duration-200 focus:outline-none rounded-lg ${isTv ? 'px-2 py-1.5' : 'px-3 py-2.5'} ${navActive && focusMeta && focusedIndex === focusMeta.index ? 'ring-2 ring-brand/70' : ''}`}
      onClick={handleCardClick}
      tabIndex={0}
      data-role="server-item"
      ref={(el) => onRegisterFocusable?.(el as unknown as HTMLElement, focusMeta || { index: 0, col: 1, row: 0, role: 'server-item' })}
      style={{
        opacity: 1,
        pointerEvents: isPending ? 'none' : 'auto',
        backgroundColor: isPending ? `${colors.brand.primary}25` : baseBackground,
        borderColor: isPending ? colors.brand.primary : (isActive ? colors.brand.primary : colors.border.secondary),
        borderWidth: isPending ? '2px' : '1px',
        boxShadow: isPending 
          ? `0 0 0 3px ${colors.brand.primary}20, 0 4px 12px rgba(0,0,0,0.12)` 
          : 'none',
        transition: 'background-color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, border-width 0.2s ease',
        animation: isPending ? 'pulse-server 1.5s ease-in-out infinite' : 'none'
      }}
    >
      <div className="flex items-center gap-3 w-full">
        {/* Icono del servidor */}
        <div 
          className={`rounded-lg flex items-center justify-center flex-shrink-0 ${isTv ? 'w-7 h-7' : 'w-9 h-9'}`}
          style={{
            backgroundColor: isActive ? `${colors.brand.primary}22` : colors.background.tertiary,
          }}
        >
          {config.icon ? (
            <img src={config.icon} alt="" className="w-6 h-6 object-cover rounded" />
          ) : (
            <Server className="w-5 h-5" style={{ color: colors.text.tertiary }} />
          )}
        </div>

        {/* Contenido principal - expandido */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className={`flex items-center gap-2 ${isTv ? 'mb-0' : 'mb-1'}`}>
                <Text
                  variant="body"
                  color="primary"
                  className="font-medium truncate"
                  style={{ fontSize: isTv ? '12px' : '15px', lineHeight: isTv ? '16px' : '22px' }}
                >
                  {config.name}
                </Text>
                {isActive && (
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: colors.brand.primary }} />
                )}
              </div>

              <div
                className={`flex items-center gap-2 uppercase tracking-[0.1em] ${isTv ? 'text-[8px]' : 'text-[10px]'}`}
                style={{ color: colors.text.tertiary }}
              >
                <span>{protocolLabel}</span>
                <span className="opacity-60">•</span>
                <span className="flex-1">{statusInfo.label}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {isPending ? (
                <Spinner size="sm" color="brand" inline />
              ) : null}
            </div>
          </div>

          {hasDescription && showDescriptions && (
            <Text
              variant="bodySmall"
              color="tertiary"
              className={`leading-relaxed ${isTv ? 'mt-0 text-[10px]' : 'mt-1 text-[13px]'}`}
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden'
              }}
            >
              {config.description}
            </Text>
          )}
          {hasDescription && !showDescriptions && (
            <div data-description-content onClick={(e) => e.stopPropagation()} className="mt-2">
              <button
                type="button"
                data-description-toggle
                onClick={() => setDescriptionOpen((prev) => !prev)}
                className="flex items-center gap-1 text-[10px] tracking-[0.18em] uppercase text-secondary"
                aria-expanded={isDescriptionOpen}
              >
                {isDescriptionOpen
                  ? t.serverSelectorScreen.serverView.descriptionToggle.hide
                  : t.serverSelectorScreen.serverView.descriptionToggle.show}
                {isDescriptionOpen ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
              {isDescriptionOpen && (
                <Text
                  variant="bodySmall"
                  color="tertiary"
                  className={`leading-relaxed mt-2 ${isTv ? 'text-[10px]' : 'text-[13px]'}`}
                  style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                    overflow: 'hidden'
                  }}
                >
                  {config.description}
                </Text>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
