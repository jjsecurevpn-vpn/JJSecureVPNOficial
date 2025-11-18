/**
 * @file DeviceInfoCard.tsx
 */
import React, { useEffect, useRef, useState } from 'react';
import { Smartphone, Copy, CheckCheck, Hash } from 'lucide-react';
import { useTranslations } from '../../../../../context/LanguageContext';

const COPY_FEEDBACK_MS = 1800;

export const DeviceInfoCard: React.FC = () => {
  const [deviceID, setDeviceID] = useState<string | null>(null);
  const [appVersion, setAppVersion] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const t = useTranslations();
  const resetTimer = useRef<number | null>(null);

  useEffect(() => {
    try {
      setDeviceID((window as any).DtGetDeviceID?.execute?.() ?? null);
    } catch {}
    try {
      setAppVersion((window as any).DtAppVersion?.execute?.() ?? null);
    } catch {}

    return () => {
      if (resetTimer.current !== null) {
        window.clearTimeout(resetTimer.current);
      }
    };
  }, []);

  const copy = (text?: string | null) => {
    if (!text) return;
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      if (resetTimer.current !== null) {
        window.clearTimeout(resetTimer.current);
      }
      resetTimer.current = window.setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
    });
  };

  return (
    <div className="card-base w-full gap-4 overflow-hidden p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-text">
          <Smartphone className="h-4 w-4" strokeWidth={1.5} />
          <span className="truncate">{t.userProfileScreen.deviceInfo.device}</span>
        </div>
        <div className="text-[10px] font-medium uppercase tracking-wide text-neutral-muted">
          {t.userProfileScreen.deviceInfo.version}: {" "}
          <span className="text-white">{appVersion || "—"}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-surface-border/60 bg-surface-border/30 px-4 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-border/60">
          <Hash className="h-4 w-4 text-brand" strokeWidth={1.5} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-wide text-neutral-muted">
            {t.userProfileScreen.deviceInfo.deviceId}
          </p>
          <p className="truncate text-sm font-semibold leading-tight text-white" title={deviceID || undefined}>
            {deviceID || "—"}
          </p>
          {copied && (
            <span className="text-[11px] font-medium text-emerald-300">
              {t.credentialsPanel?.statusMessages?.saved || "Copied"}
            </span>
          )}
        </div>
        <button
          onClick={() => copy(deviceID)}
          className="rounded-lg border border-surface-border/60 bg-surface/40 p-2 text-neutral-text transition-colors hover:text-white"
          aria-label={t.userProfileScreen.deviceInfo.copyIdLabel}
        >
          {copied ? <CheckCheck className="h-4 w-4" strokeWidth={1.5} /> : <Copy className="h-4 w-4" strokeWidth={1.5} />}
        </button>
      </div>
    </div>
  );
};
