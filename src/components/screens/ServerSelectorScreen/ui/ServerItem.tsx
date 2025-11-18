/**
 * @file ServerItem.tsx
 * @description Componente reutilizable para mostrar items de servidor - Diseño elegante y profesional
 */

import { Check, Server } from 'lucide-react';
import { Spinner } from '../../../ui/Spinner';
import { ConfigItem } from '../../../../types/config';
import { Card } from '../../../ui/Card';
import { Text } from '../../../ui/Text';
import { colors } from '../../../../constants/theme';
import { useState } from 'react';
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
  focusedIndex
}: ServerItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations();
  // Detectar TV
  const isTv = typeof window !== 'undefined' && window.innerWidth >= 1024;
  const statusInfo = getStatusInfo?.(config.name, config.description) || { label: t.serverSelectorScreen.serverCard.select, dotClass: 'bg-slate-400' };
  const baseBackground = isActive ? `${colors.brand.primary}15` : colors.background.secondary;
  const hoverBackground = isActive ? `${colors.brand.primary}18` : colors.background.tertiary;
  const protocolLabel = getProtocol(config.mode);
  const hasDescription = Boolean(config.description);

  return (
    <Card
      variant={isActive ? 'selected' : 'interactive'}
      className={`cursor-pointer transition-all duration-200 focus:outline-none rounded-lg ${isTv ? 'px-2 py-1.5' : 'px-3 py-2.5'} ${navActive && focusMeta && focusedIndex === focusMeta.index ? 'ring-2 ring-brand/70' : ''}`}
      onClick={() => !isPending && onSelect(config)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      data-role="server-item"
      ref={(el) => onRegisterFocusable?.(el as unknown as HTMLElement, focusMeta || { index: 0, col: 1, row: 0, role: 'server-item' })}
      style={{
        opacity: 1,
        pointerEvents: isPending ? 'none' : 'auto',
        backgroundColor: isPending ? `${colors.brand.primary}25` : (isHovered ? hoverBackground : baseBackground),
        borderColor: isPending ? colors.brand.primary : (isActive ? colors.brand.primary : colors.border.secondary),
        borderWidth: isPending ? '2px' : '1px',
        boxShadow: isPending 
          ? `0 0 0 3px ${colors.brand.primary}20, ${isHovered ? '0 6px 18px rgba(0,0,0,0.16)' : '0 4px 12px rgba(0,0,0,0.12)'}` 
          : (isHovered ? '0 6px 18px rgba(0,0,0,0.16)' : 'none'),
        transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, border-width 0.2s ease',
        animation: isPending ? 'pulse-server 1.5s ease-in-out infinite' : 'none'
      }}
    >
      <div className="flex items-center gap-3">
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

        {/* Contenido principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
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
                <span>{statusInfo.label}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {isPending ? (
                <Spinner size="sm" color="brand" inline />
              ) : (
                <span
                  className={`rounded-full ${isTv ? 'w-1.5 h-1.5' : 'w-2 h-2'}`}
                  style={{
                    backgroundColor: isActive ? colors.brand.primary : colors.accent.primary
                  }}
                  title={statusInfo.label}
                  aria-label={statusInfo.label}
                />
              )}
            </div>
          </div>

          {hasDescription && (
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
        </div>
      </div>
    </Card>
  );
}
