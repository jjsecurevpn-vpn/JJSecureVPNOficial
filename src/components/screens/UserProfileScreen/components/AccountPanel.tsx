/**
 * @file AccountPanel.tsx
 * @description Panel de información de cuenta específico para UserProfileScreen
 */

import React from "react";
import { AlertTriangle, RefreshCw, Users, Clock, Lock } from "lucide-react";
// Botón de soporte removido: ahora existe un único botón global en la pantalla
import { useTranslations, useLanguage } from "../../../../context/LanguageContext";
import type { UserData } from "../types";

interface AccountPanelProps {
  data: UserData;
  onRenew: () => void;
}

const formatDate = (dateString: string, language: string = 'es'): string => {
  try {
    const [day, month, year] = dateString.split("/");
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const locale = language === 'en' ? 'en-US' : language === 'pt' ? 'pt-BR' : 'es-ES';
    return date.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return dateString;
  }
};

const getStatusInfo = (days: number, t: any) => {
  if (days <= 0)
    return {
      text: t.userProfileScreen.accountPanel.expired,
      color: "text-red-200",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      dot: "bg-red-400",
    };
  if (days <= 5)
    return {
      text: t.userProfileScreen.accountPanel.aboutToExpire,
      color: "text-amber-200",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      dot: "bg-amber-300",
    };
  return {
    text: t.userProfileScreen.accountPanel.active,
    color: "text-emerald-200",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    dot: "bg-emerald-400",
  };
};

export const AccountPanel: React.FC<AccountPanelProps> = ({ data: userData, onRenew }) => {
  const t = useTranslations();
  const { currentLanguage } = useLanguage();

  const status = getStatusInfo(userData.expiration_days, t);
  const daysDisplay = userData.expiration_days > 0 ? userData.expiration_days : 0;
  const connectionUsage = userData.limit_connections
    ? Math.min(100, Math.max(0, Math.round((userData.count_connections / userData.limit_connections) * 100)))
    : 0;
  const expirationDescriptor =
    userData.expiration_days > 0
      ? t.userProfileScreen.accountPanel.inDays
          .replace("{count}", userData.expiration_days.toString())
          .replace("{plural}", userData.expiration_days === 1 ? "" : "s")
      : t.userProfileScreen.accountPanel.expiredLabel;
  const showRenewButton = userData.expiration_days <= 5 && userData.expiration_days > -5;
  const showRenewWarning = userData.expiration_days <= 5;

  return (
    <div className="mx-auto w-full max-w-4xl font-sans">
      <div className="panel-base-lg relative overflow-hidden border-surface-border/80 bg-surface/95 p-6 shadow-[0_18px_45px_rgba(10,10,22,0.45)]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-brand/10" />
        <div className="relative flex flex-col gap-6">
          {/* Encabezado */}
          <div className="flex flex-wrap items-start gap-4">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-neutral-muted">
                {t.userProfileScreen.header.myAccount}
              </span>
              <h2 className="mt-2 truncate text-[18px] font-semibold leading-6 text-white">
                {userData.username}
              </h2>
              <div className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed text-neutral-text">
                <Clock className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-neutral-muted" strokeWidth={1.5} />
                <p className="flex-1">
                  {t.userProfileScreen.accountPanel.expiresOn}{" "}
                  <span className="font-semibold text-white">
                    {formatDate(userData.expiration_date, currentLanguage)}
                  </span>{" "}
                  <span className="text-neutral-muted">
                    ({expirationDescriptor})
                  </span>
                </p>
              </div>
            </div>
            <div
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-sm ${status.bg} ${status.border}`}
            >
              <span className={`h-2 w-2 rounded-full ${status.dot}`} />
              <span className={`${status.color} text-[11px] font-semibold uppercase tracking-[0.25em]`}>
                {status.text}
              </span>
            </div>
          </div>

          {/* Métricas principales */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-surface-border/70 bg-surface-border/40 px-4 py-3">
              <span className="text-[11px] font-medium uppercase tracking-wide text-neutral-muted">
                {t.userProfileScreen.accountPanel.days}
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-white leading-none">{daysDisplay}</span>
                <span className="text-[11px] font-medium text-neutral-text leading-none">
                  {status.text}
                </span>
              </div>
            </div>
            <div className="rounded-xl border border-surface-border/70 bg-surface-border/40 px-4 py-3">
              <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-neutral-muted">
                <Users className="h-3.5 w-3.5 text-neutral-muted" strokeWidth={1.5} />
                {t.userProfileScreen.accountPanel.connections}
              </span>
              <div className="mt-2 text-2xl font-semibold leading-none text-white">
                {userData.count_connections}
              </div>
              <p className="text-[11px] font-medium text-neutral-text">
                {t.userProfileScreen.accountPanel.activeConnections}
              </p>
            </div>
            <div className="rounded-xl border border-surface-border/70 bg-surface-border/40 px-4 py-3">
              <span className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-neutral-muted">
                <Lock className="h-3.5 w-3.5 text-brand" strokeWidth={1.5} />
                {t.userProfileScreen.accountPanel.limit}
              </span>
              <div className="mt-2 text-2xl font-semibold leading-none text-brand">
                {userData.limit_connections}
              </div>
              <p className="text-[11px] font-medium text-neutral-text">
                {t.userProfileScreen.accountPanel.connections}
              </p>
            </div>
          </div>

          {/* Progreso de conexiones */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-wide text-neutral-muted">
              <span>{t.userProfileScreen.accountPanel.connections}</span>
              <span className="text-sm font-semibold text-white">
                {userData.count_connections}/{userData.limit_connections}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-border">
              <div
                className="h-full rounded-full bg-brand transition-all duration-500"
                style={{ width: `${connectionUsage}%` }}
              />
            </div>
          </div>

          {/* Aviso de renovación */}
          {showRenewWarning && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/10 p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-300" strokeWidth={1.5} />
              <div className="space-y-1">
                <h4 className="text-[12px] font-semibold leading-4 text-amber-200">
                  {t.userProfileScreen.accountPanel.renewWarningTitle}
                </h4>
                <p className="text-[12px] leading-5 text-amber-100/85">
                  {t.userProfileScreen.accountPanel.renewWarningDesc}
                </p>
              </div>
            </div>
          )}

          {/* Acciones */}
          {showRenewButton && (
            <div className="flex justify-end">
              <button
                onClick={onRenew}
                className="btn-base-sm bg-brand text-white shadow-[0_12px_32px_rgba(98,94,255,0.35)]"
              >
                <RefreshCw className="h-4 w-4" strokeWidth={1.5} />
                {t.userProfileScreen.accountPanel.renewSubscription}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
