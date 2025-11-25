/**
 * @file SessionStatsCard.tsx
 */
import React from 'react';
import {
  Activity,
  Download,
  Upload,
  Gauge,
  ArrowDownCircle,
  ArrowUpCircle,
} from 'lucide-react';
import { useSessionStats } from '../../hooks/useSessionStats';
import { useTranslations } from '../../../../../context/LanguageContext';

interface Props {
  isConnected: boolean;
  isLoading: boolean;
}

export const SessionStatsCard: React.FC<Props> = ({ isConnected, isLoading }) => {
  const { ping, localIP, networkName, formatted } = useSessionStats(6000);
  const t = useTranslations();

  if (!isConnected) return null;

  return (
  <div className="card-base w-full gap-5 overflow-hidden p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-text">
          <Activity className="h-4 w-4" strokeWidth={1.5} />
          <span>{t.userProfileScreen.sessionStats.session}</span>
        </div>
        <div className="text-[10px] font-medium uppercase tracking-wide text-neutral-muted">
          {t.userProfileScreen.sessionStats.ping}: {" "}
          <span className="text-white">{isLoading || ping == null ? "—" : `${ping}ms`}</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            icon: <Gauge className="h-4 w-4 text-neutral-text" strokeWidth={1.5} />,
            label: t.userProfileScreen.sessionStats.ping,
            value: isLoading || ping == null ? "—" : `${ping}ms`,
          },
          {
            icon: <Download className="h-4 w-4 text-neutral-text" strokeWidth={1.5} />,
            label: t.userProfileScreen.sessionStats.download,
            value: isLoading ? "—" : formatted.download,
          },
          {
            icon: <Upload className="h-4 w-4 text-neutral-text" strokeWidth={1.5} />,
            label: t.userProfileScreen.sessionStats.upload,
            value: isLoading ? "—" : formatted.upload,
          },
        ].map(({ icon, label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-surface-border/60 bg-surface-border/30 px-4 py-3 text-center"
          >
            <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-surface-border/50">
              {icon}
            </div>
            <div className="text-sm font-semibold leading-tight text-white">{value}</div>
            <div className="text-[10px] font-medium uppercase tracking-wide text-neutral-muted">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {[{
          icon: <ArrowDownCircle className="h-4 w-4 text-[#7f6bff]" strokeWidth={1.5} />,
          label: t.userProfileScreen.sessionStats.downloadSpeed,
          value: formatted.downloadRate,
        }, {
          icon: <ArrowUpCircle className="h-4 w-4 text-[#7f6bff]" strokeWidth={1.5} />,
          label: t.userProfileScreen.sessionStats.uploadSpeed,
          value: formatted.uploadRate,
        }].map(({ icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl border border-surface-border/60 bg-surface-border/20 px-4 py-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7f6bff]/15">
              {icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight text-[#bfb2ff]">{value}</p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-muted">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-y-2 gap-x-4 text-[11px] leading-tight text-neutral-muted">
        <span className="min-w-0 flex-1 truncate" title={networkName ?? undefined}>
          {t.userProfileScreen.sessionStats.network}: {networkName ?? "—"}
        </span>
        <span className="min-w-0 flex-1 truncate text-right" title={localIP ?? undefined}>
          {t.userProfileScreen.sessionStats.localIP}: {localIP ?? "—"}
        </span>
      </div>
    </div>
  );
};
