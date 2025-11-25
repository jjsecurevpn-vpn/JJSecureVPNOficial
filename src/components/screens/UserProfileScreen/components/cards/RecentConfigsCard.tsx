/**
 * @file RecentConfigsCard.tsx
 */
import React from 'react';
import { History } from 'lucide-react';
import { useRecentConfigs } from '../../hooks/useRecentConfigs';
import { useTranslations, useLanguage } from '../../../../../context/LanguageContext';

export const RecentConfigsCard: React.FC = () => {
  const recent = useRecentConfigs();
  const t = useTranslations();
  const { currentLanguage } = useLanguage();
  
  const getLocale = (language: string) => {
    switch (language) {
      case 'en':
        return 'en-US';
      case 'pt':
        return 'pt-BR';
      default:
        return 'es-ES';
    }
  };
  const locale = getLocale(currentLanguage);

  if (!recent.length) return null;
  return (
  <div className="card-base w-full gap-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-text">
          <History className="h-4 w-4" strokeWidth={1.5} />
          <span>{t.userProfileScreen.recentConfigs.recent}</span>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-wide text-neutral-muted">
          {recent.length}
        </span>
      </div>

      <ul className="space-y-3">
        {recent.map((r, index) => {
          const date = new Date(r.timestamp);
          const timeLabel = date.toLocaleTimeString(locale, {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <li
              key={r.timestamp}
              className="flex items-center gap-3 rounded-xl border border-surface-border/60 bg-surface-border/20 px-3 py-2.5 text-[11px]"
            >
              {r.icon ? (
                <div className="h-10 w-10 overflow-hidden rounded-lg border border-surface-border/60 bg-surface">
                  <img src={r.icon} alt={r.name} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-border/60 text-[10px] font-semibold uppercase tracking-wide text-neutral-muted">
                  {index + 1}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold leading-tight text-white">
                  {r.name || t.userProfileScreen.recentConfigs.config}
                </p>
                <p className="truncate text-[11px] leading-tight text-neutral-muted">
                  {r.mode || '—'}
                </p>
              </div>
              <time
                className="text-[10px] font-medium uppercase tracking-wide text-neutral-faint"
                dateTime={date.toISOString()}
              >
                {timeLabel}
              </time>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
