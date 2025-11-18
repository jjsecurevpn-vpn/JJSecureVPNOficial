import React from 'react';
import { useTranslations } from '../../../../hooks/useTranslations';
import { useResponsive } from '../../../../hooks/useResponsive';
import { useResponsiveUI } from '../../../../responsive/unifiedResponsive';
import { useSafeArea } from '../../../../utils/deviceUtils';

interface TvModeHeaderProps {
  activeConfigName?: string;
  onHowItWorks: () => void;
  onExitTvMode: () => void;
  isCompact?: boolean;
}

export const TvModeHeader: React.FC<TvModeHeaderProps> = ({ 
  activeConfigName, 
  onHowItWorks, 
  onExitTvMode,
  isCompact = false,
}) => {
  const { t } = useTranslations();
  const responsive = useResponsive();
  const { tokens, spacePx } = useResponsiveUI();
  const { statusBarHeight, navigationBarHeight } = useSafeArea();
  
  // HD-specific optimization (1366x768 and similar)
  const w = responsive.width;
  const h = responsive.height;
  const isHDResolution = w >= 1280 && w <= 1400 && h <= 800;
  const isTvResolution = w >= 1024;
  
  const sizeVariant = isCompact ? 'compact' : (isHDResolution ? 'hd' : isTvResolution ? 'tv' : 'default');
  const titleClass = 
    sizeVariant === 'compact' ? 'text-2xl' : 
    sizeVariant === 'hd' ? 'text-lg' : 
    sizeVariant === 'tv' ? 'text-lg' :
    'text-3xl';
  const subtitleClass = 
    sizeVariant === 'compact' ? 'text-[11px]' : 
    sizeVariant === 'hd' ? 'text-[9px]' : 
    sizeVariant === 'tv' ? 'text-[9px]' :
    'text-xs';
  const pillTextClass = 
    sizeVariant === 'compact' ? 'text-[11px]' : 
    sizeVariant === 'hd' ? 'text-[9px]' : 
    sizeVariant === 'tv' ? 'text-[9px]' :
    'text-xs';
  const buttonPadding = 
    sizeVariant === 'compact' ? 'px-3 py-1.5' : 
    sizeVariant === 'hd' ? 'px-2.5 py-1' : 
    sizeVariant === 'tv' ? 'px-2.5 py-1' :
    'px-4 py-2';

  return (
    <div
      className="flex items-center justify-between bg-gradient-to-r from-surface/70 to-surface/50 border-b border-surface-border/50 backdrop-blur-sm"
      style={{
        paddingTop: `calc(${spacePx(sizeVariant === 'compact' ? 3 : sizeVariant === 'hd' || sizeVariant === 'tv' ? 2 : 4)}px + ${statusBarHeight}px)`,
        paddingBottom: spacePx(sizeVariant === 'compact' ? 3 : sizeVariant === 'hd' || sizeVariant === 'tv' ? 2 : 4),
        paddingLeft: `calc(${tokens.spacing.container}px + env(safe-area-inset-left, 0px))`,
        paddingRight: `calc(${tokens.spacing.container}px + ${responsive.isLandscape ? navigationBarHeight : 0}px + env(safe-area-inset-right, 0px))`,
      }}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <h1 className={`${titleClass} font-bold tracking-tight text-brand`}>JJSecure</h1>
          <span className={`${sizeVariant === 'compact' ? 'text-xl' : sizeVariant === 'hd' || sizeVariant === 'tv' ? 'text-sm' : 'text-2xl'} font-semibold text-neutral-strong`}>VP-N</span>
        </div>
        <span className={`${subtitleClass} leading-snug text-neutral-text/60 select-none font-medium`}
        >
          Modo TV • Usa el ratón o pantalla táctil
        </span>
      </div>
      <div className="flex items-center gap-3">
        {!isCompact && (
          <div className="text-sm opacity-80 hidden sm:block font-medium">
            {activeConfigName ? activeConfigName : (t.tvMode?.noServerSelected || 'Sin servidor')}
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={onHowItWorks}
            className={`${buttonPadding} rounded-lg bg-brand hover:bg-primary-600 text-white ${pillTextClass} font-semibold transition-all duration-200 shadow-md hover:shadow-lg`}
            title={t.tvMode?.howItWorksModal?.title || 'Aprende cómo funciona la app'}
          >
            {t.tvMode?.howItWorksModal?.title || '¿Cómo Funciona?'}
          </button>
          <button
            onClick={onExitTvMode}
            className={`${buttonPadding} rounded-lg bg-slate-700 hover:bg-slate-600 text-white ${pillTextClass} font-semibold transition-all duration-200 shadow-md hover:shadow-lg`}
            title={t.welcome?.mobileMode || 'Modo Móvil'}
          >
            {t.welcome?.mobileMode || 'Modo Móvil'}
          </button>
        </div>
      </div>
    </div>
  );
};
