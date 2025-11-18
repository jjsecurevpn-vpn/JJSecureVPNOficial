import { Crown, Globe, Wifi, Shield } from "lucide-react";
import React from "react";
import { useTranslations } from "../../../hooks/useTranslations";

interface PremiumFeaturesProps {
  onOpenPricingScreen?: () => void;
}

function PremiumFeaturesComponent({ onOpenPricingScreen }: PremiumFeaturesProps) {
  const { t } = useTranslations();
  const labels = t.bottomSheetServerSelector.premiumFeatures;
  
  const features = [
    {
      icon: Globe,
      title: labels.features.globalCoverage.title,
      description: labels.features.globalCoverage.description,
    },
    {
      icon: Wifi,
      title: labels.features.fasterBrowsing.title,
      description: labels.features.fasterBrowsing.description,
    },
    {
      icon: Shield,
      title: labels.features.advancedSecurity.title,
      description: labels.features.advancedSecurity.description,
    },
  ];

  return (
    <div className="p-4 border-t border-surface-border">
      {/* Título */}
      <div className="flex items-center gap-2 mb-4">
        <Crown size={20} className="text-brand" />
        <span className="text-h4 text-neutral-strong font-semibold">
          {labels.title}
        </span>
      </div>

      {/* Tarjetas de características */}
      <div className="premium-cards-container hide-scrollbar flex gap-4 overflow-x-auto overflow-y-hidden pb-2">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="premium-cards min-w-[180px] w-[180px] bg-surface/70 rounded-xl p-4 border border-surface-border flex flex-col gap-3"
          >
            <div className="w-12 h-12 rounded-lg bg-brand flex items-center justify-center flex-shrink-0">
              <Icon size={24} className="text-white" />
            </div>
            <div>
              <div className="text-h4 text-neutral-strong font-semibold leading-snug mb-1">
                {title}
              </div>
              <div className="text-caption text-neutral-text leading-snug">
                {description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botón de actualización */}
      <button
        onClick={onOpenPricingScreen}
        className="w-full h-11 rounded-xl bg-brand hover:bg-primary-700 active:scale-[0.98] transition-all duration-200 text-white text-btn font-semibold mt-4"
      >
        {labels.upgradeButton}
      </button>

      {/* Espaciador */}
      <div className="h-5 w-full" />
    </div>
  );
}

export const PremiumFeatures = React.memo(PremiumFeaturesComponent);
