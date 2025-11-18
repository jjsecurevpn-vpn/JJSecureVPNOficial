/**
 * @file AccountSection.tsx
 * @description Cabecera refinada de Settings con resumen y acceso premium
 */

import React from "react";
import { Headphones } from "lucide-react";
import { AccountSectionProps } from "../types";
import { PremiumUpgradeCard } from "./PremiumUpgradeCard";

export const AccountSection: React.FC<AccountSectionProps> = ({ onOpenPremiumInfo }) => {

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex flex-col gap-6">
        <PremiumUpgradeCard onOpenInfo={onOpenPremiumInfo} />

  <div className="card-base w-full gap-4 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
              <Headphones className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-pretty text-sm font-semibold leading-tight text-white">Centro de ayuda</p>
              <p className="mt-1 text-pretty text-[12px] leading-5 text-neutral-text">
                Accede a guías actualizadas, configuraciones recomendadas y canales directos de soporte técnico.
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled
            className="btn-base-sm w-full justify-center border border-surface-border/80 bg-surface/60 text-neutral-text opacity-50 cursor-not-allowed"
          >
            Próximamente
          </button>
        </div>
      </div>
    </div>
  );
};
