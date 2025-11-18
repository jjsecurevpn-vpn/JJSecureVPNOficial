/**
 * @file SupportCard.tsx
 */
import React from "react";
import { LifeBuoy, MessageCircle, BookOpen, ExternalLink } from "lucide-react";
import { useTranslations } from "../../../../../context/LanguageContext";

interface SupportCardProps {
  onContactSupport: () => void;
}

export const SupportCard: React.FC<SupportCardProps> = ({ onContactSupport }) => {
  const t = useTranslations();
  const support = t.userProfileScreen.support;

  const fallbackTips: string[] = [
    "Comparte capturas de pantalla y el servidor que estás usando para acelerar el diagnóstico.",
    'Si necesitas prioridad responde "Soporte" en el chat para que el equipo te atienda primero.',
  ];

  const labels = {
    title: support?.title ?? "Soporte y ayuda",
    subtitle:
      support?.subtitle ??
      "Recibe asistencia personalizada y accede a recursos para resolver cualquier incidencia.",
    directContact: support?.directContact ?? "Atención inmediata",
    directContactHint:
      support?.directContactHint ??
      "Abriremos el chat oficial para que hables directo con nuestro equipo.",
    resources: support?.community ?? "Centro de recursos",
    resourcesHint:
      support?.communityHint ??
      "Guías actualizadas, novedades y configuraciones recomendadas en un solo lugar.",
    contactCta: support?.contactCta ?? t.userProfileScreen.accountPanel.contactSupport,
    tipsTitle: support?.tipsTitle ?? "Consejos rápidos",
    tips: support?.tips ?? fallbackTips,
  };

  return (
  <div className="card-base w-full gap-5 overflow-hidden p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
          <LifeBuoy className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight text-white">{labels.title}</p>
          <p className="mt-1 text-[12px] leading-relaxed text-neutral-text">{labels.subtitle}</p>
        </div>
      </div>

      <div className="space-y-3 text-[12px]">
        <div className="flex items-start gap-3 rounded-xl border border-surface-border/60 bg-surface-border/30 px-4 py-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
            <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight text-white">{labels.directContact}</p>
            <p className="text-[11px] leading-relaxed text-neutral-muted">
              {labels.directContactHint}
            </p>
          </div>
        </div>

        <button
          onClick={onContactSupport}
          className="btn-base-sm w-full justify-center bg-brand text-white shadow-[0_12px_32px_rgba(98,94,255,0.32)] hover:bg-brand/90"
          type="button"
        >
          <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
          {labels.contactCta}
        </button>

        <div className="flex items-start gap-3 rounded-xl border border-surface-border/60 bg-surface-border/20 px-4 py-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/5 text-neutral-text">
            <BookOpen className="h-4 w-4" strokeWidth={1.5} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight text-white">{labels.resources}</p>
            <p className="text-[11px] leading-relaxed text-neutral-muted">
              {labels.resourcesHint}
            </p>
          </div>
          <ExternalLink className="h-4 w-4 text-neutral-muted" strokeWidth={1.5} />
        </div>
      </div>

      <div className="rounded-xl border border-surface-border/60 bg-surface-border/10 px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-muted">
          {labels.tipsTitle}
        </p>
        <ul className="mt-2 space-y-1.5 text-[11px] leading-relaxed text-neutral-muted/90">
          {labels.tips.map((tip: string) => (
            <li key={tip} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand" />
              <span className="flex-1">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
