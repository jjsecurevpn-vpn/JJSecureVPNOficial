/**
 * @file PremiumInfoModal.tsx
 * @description Modal informativo sobre los planes Premium, específico para SettingsScreen
 */

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Info, CheckCircle2, Crown } from 'lucide-react';
import { useSafeArea } from '../../../../utils/deviceUtils';
import { useTranslations } from '../../../../context/LanguageContext';

interface PremiumInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumInfoModal: React.FC<PremiumInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const { getModalStyle, navigationBarHeight } = useSafeArea();
  const t = useTranslations();

  useEffect(() => {
    if (isOpen) setIsAnimating(true);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => onClose(), 250);
  };

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[9998] transition-opacity duration-250 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 2147483000 }}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[9999] transition-transform duration-250 ease-out rounded-t-2xl border-t border-gray-700/50 shadow-2xl ${
          isAnimating ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ 
          ...getModalStyle(60), 
          backgroundColor: '#1a1a24', 
          zIndex: 2147483001,
          paddingBottom: `${navigationBarHeight}px`,
        }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700/50 rounded-t-2xl" style={{ backgroundColor: '#1a1a24' }}>
          <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-4"></div>
          <div className="flex items-center justify-between">
            <button
              onClick={handleClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-700 transition-colors"
              style={{ backgroundColor: '#1a1a24' }}
              aria-label="Cerrar"
            >
              <X className="w-4 h-4 text-gray-300" />
            </button>
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-500" />
              <h1 className="text-lg font-semibold text-white" style={{ fontFamily: '"ABC Arizona Flare", Inter, Roboto, sans-serif' }}>
                {t.settings.premiumInfo.title}
              </h1>
            </div>
            <div className="w-8" />
          </div>
        </div>

        {/* Content */}
        <div 
          className="px-4 py-4 space-y-4 overflow-y-auto" 
          style={{ 
            backgroundColor: '#1a1a24',
            maxHeight: `calc(60vh - 120px - ${navigationBarHeight}px)`,
          }}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Info className="w-4 h-4 text-purple-300" />
            </div>
            <div className="text-gray-200 text-sm" style={{ fontFamily: '"ABC Arizona Sans", Inter, Roboto, sans-serif' }}>
              <p className="mb-2">{t.settings.premiumInfo.subtitle}</p>
              <p>{t.settings.premiumInfo.description}</p>
            </div>
          </div>

          <div className="space-y-3">
            {t.settings.premiumInfo.features.map((text, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                <p className="text-gray-200 text-sm" style={{ fontFamily: '"ABC Arizona Sans", Inter, Roboto, sans-serif' }}>{text}</p>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                handleClose();
                // Abre el enlace externo en webview nativo
                if (window.DtOpenWebview) {
                  window.DtOpenWebview.execute("https://shop.jhservices.com.ar/planes");
                } else if (window.DtStartWebViewActivity) {
                  window.DtStartWebViewActivity.execute("https://shop.jhservices.com.ar/planes");
                } else {
                  // Fallback para desarrollo
                  window.open("https://shop.jhservices.com.ar/planes", "_blank");
                }
              }}
              className="btn-sm-action w-full h-11 rounded-xl text-btn"
              style={{ fontFamily: '"ABC Arizona Sans", Inter, Roboto, sans-serif' }}
            >
              {t.settings.premiumInfo.upgradeButton}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default PremiumInfoModal;
