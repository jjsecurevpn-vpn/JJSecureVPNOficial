/**
 * @file PremiumUpgradeCard.tsx
 * @description Tarjeta premium con estética alineada al nuevo layout
 */

import React from "react";
import { Crown, Info, Sparkles } from "lucide-react";
import { uiAPI } from "../../../../utils/unifiedNativeAPI";

interface PremiumUpgradeCardProps {
  onOpenInfo?: () => void;
}

export const PremiumUpgradeCard: React.FC<PremiumUpgradeCardProps> = ({ onOpenInfo }) => {
  const openExternal = (url: string) => uiAPI.openWebView(url);

  return (
  <div className="relative overflow-hidden rounded-2xl border border-brand/30 bg-gradient-to-br from-[#241d44] via-[#1a1833] to-[#0f0f1c] p-5 shadow-[0_20px_48px_rgba(26,18,60,0.45)] sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,185,107,0.22),transparent_60%)]" />

      <div className="relative flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white shadow-[0_10px_25px_rgba(0,0,0,0.35)]">
            <Crown className="h-6 w-6" strokeWidth={1.5} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/60">Premium</p>
                <h3 className="mt-2 text-pretty text-base font-semibold leading-6 text-white sm:text-lg">
                  Servidores exclusivos y priorización de tráfico
                </h3>
              </div>
              {onOpenInfo && (
                <button
                  type="button"
                  onClick={onOpenInfo}
                  className="rounded-full p-2 text-white/70 transition hover:text-white"
                  aria-label="Información de Premium"
                >
                  <Info className="h-4 w-4" strokeWidth={1.5} />
                </button>
              )}
            </div>
            <p className="mt-2 text-pretty text-[12px] leading-5 text-white/70">
              Mejora la estabilidad, desbloquea más conexiones simultáneas y accede a soporte preferencial pensado para power users.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => openExternal("https://shop.jhservices.com.ar/planes")}
            className="btn-base-sm w-full justify-center bg-white/15 text-white shadow-[0_12px_32px_rgba(15,10,40,0.4)] hover:bg-white/20"
          >
            Ver planes Premium
          </button>
          <button
            type="button"
            onClick={() => openExternal("https://shop.jhservices.com.ar/revendedores")}
            className="btn-base-sm w-full justify-center border border-emerald-400/40 bg-emerald-500/15 text-emerald-100 transition hover:border-emerald-300/60 hover:bg-emerald-400/20"
          >
            Programa de revendedores
          </button>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[12px] text-white/70">
          <Sparkles className="h-4 w-4 text-white/80" strokeWidth={1.5} />
          <span className="text-pretty">
            Incluye actualizaciones garantizadas, túneles dedicados y monitoreo proactivo de rendimiento.
          </span>
        </div>
      </div>
    </div>
  );
};
