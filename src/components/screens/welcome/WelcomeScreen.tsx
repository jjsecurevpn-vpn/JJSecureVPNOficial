import React, { useCallback, useEffect } from 'react';
import './welcomeStyles.css';
import { CheckCircle2, ShoppingCart, Store } from 'lucide-react';
import { GradientScreenLayout } from '../../layouts';
import { useResponsive } from '../../../hooks/useResponsive';
import { useTranslations } from '../../../context/LanguageContext';
import { setStorageItem } from '../../../utils/storageUtils';
import { LanguageSelectorBadge } from './components/LanguageSelectorBadge';
import { WelcomeActions } from './components/WelcomeActions';
import { useVirtualCursor } from './hooks/useVirtualCursor';
import { VirtualCursorOverlay } from './components/VirtualCursorOverlay';
import { useSafeArea } from '../../../utils/deviceUtils';

interface WelcomeScreenProps {
  onContinue: () => void;
  onBuyPremium: () => void;
  onResellerPlans: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue, onBuyPremium, onResellerPlans }) => {
  const responsive = useResponsive();
  const t = useTranslations();
  const cursor = useVirtualCursor();
  const { statusBarHeight, navigationBarHeight } = useSafeArea();

  // Simula movimiento pointer (mousemove) para hover states
  const emitPointerMove = useCallback((x:number, y:number) => {
    const el = document.elementFromPoint(x, y);
    if (!el) return;
    const evt = new MouseEvent('mousemove', { bubbles: true, cancelable: true, clientX: x, clientY: y });
    el.dispatchEvent(evt);
  }, []);

  // Cada vez que cambia la posición del cursor virtual
  useEffect(() => {
    if (!cursor.active) return;
    emitPointerMove(cursor.position.x, cursor.position.y);
  }, [cursor.active, cursor.position, emitPointerMove]);

  // Simular click cuando hook emite el evento
  useEffect(() => {
    const handler = () => {
      if (!cursor.active) return;
      const { x, y } = cursor.position;
      const el = document.elementFromPoint(x, y);
      if (!el) return;
      const target = el as HTMLElement;
      if ([ 'BUTTON','A','INPUT','SELECT','TEXTAREA','OPTION' ].includes(target.tagName)) {
        try { target.focus({ preventScroll:true }); } catch {}
      }
      ['mousedown','mouseup','click'].forEach(type => {
        target.dispatchEvent(new MouseEvent(type, { bubbles:true, cancelable:true, clientX:x, clientY:y, button:0 }));
      });
    };
    window.addEventListener('virtual-cursor-click', handler);
    return () => window.removeEventListener('virtual-cursor-click', handler);
  }, [cursor]);

  // Ocultar cursor nativo cuando esté activo el virtual
  useEffect(() => {
    const cls = 'virtual-cursor-active';
    if (cursor.active) document.body.classList.add(cls); else document.body.classList.remove(cls);
  }, [cursor.active]);

  // Forzar override de fondo global eliminando gradiente morado subyacente
  useEffect(() => {
    document.body.classList.add('welcome-bg-overwrite');
    return () => { document.body.classList.remove('welcome-bg-overwrite'); };
  }, []);

  return (
  <GradientScreenLayout hideHeader showParticles disableBaseGradient ignoreFooterHeight horizontalPadding={0} verticalPadding={0}>
      <style>{`
        body.virtual-cursor-active { cursor: none !important; }
      `}</style>
      <LanguageSelectorBadge />
      {/* Fondo interno eliminado para evitar duplicación; ahora sólo se usa el aplicado desde App/body */}
  <div
      className="relative w-full mx-auto flex flex-col justify-center items-center px-4 md:px-8 xl:px-12"
      style={{
        maxWidth: '1320px',
        // Usamos 100vh (viewport completo) y compensamos con padding seguro.
        minHeight: '100vh',
        // Fórmula: spacing base + max(altura nativa, env safe area). No se suman ambas para evitar duplicar.
        paddingTop: `calc(${responsive.isSmall ? 16 : 40}px + max(${statusBarHeight}px, env(safe-area-inset-top, 0px)))`,
        paddingBottom: `calc(${responsive.isSmall ? 24 : 48}px + max(${navigationBarHeight}px, env(safe-area-inset-bottom, 0px)))`,
        transition: 'padding 200ms ease',
        boxSizing: 'border-box',
        ['--safe-top' as any]: `${statusBarHeight}px`,
        ['--safe-bottom' as any]: `${navigationBarHeight}px`,
      }}
    >
        <div className="flex flex-col w-full items-center justify-center">
          <div className="welcome-panel w-full max-w-xl mx-auto p-8 md:p-12 flex flex-col items-center gap-10 animate-[fadeIn_.55s_ease]">
            <div className="wel-chip">
              <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
              <span>{t.welcome.certifiedVpn}</span>
            </div>
            <div className="text-center w-full space-y-4">
              <h1 className={`wel-title ${responsive.isSmall ? 'text-3xl leading-tight' : 'text-4xl'}`}>{t.welcome.title}</h1>
              <p className={`wel-subtitle mx-auto ${responsive.isSmall ? 'text-sm max-w-xs' : 'text-base max-w-sm'} leading-relaxed`}>{t.welcome.subtitle}</p>
            </div>
          <div className="w-full">
            <WelcomeActions
              onEnterApp={() => {
                setStorageItem('preferred-mode', 'mobile');
                try { const url = new URL(window.location.href); url.searchParams.delete('tv'); window.history.replaceState({}, '', url.toString()); } catch {}
                window.dispatchEvent(new Event('preferred-mode-change'));
                onContinue();
              }}
              onEnterTvMode={() => {
                setStorageItem('preferred-mode', 'tv');
                setStorageItem('app-welcome-completed', true);
                setStorageItem('user-guest-mode', true);
                try { const url = new URL(window.location.href); url.searchParams.set('tv','1'); window.history.replaceState({}, '', url.toString()); } catch {}
                window.dispatchEvent(new Event('preferred-mode-change'));
                onContinue();
              }}
            />
          </div>
          <div className="w-full flex flex-col gap-3">
            <button
              onClick={onBuyPremium}
              className="wel-btn-ghost w-full flex items-center justify-center gap-2 focus:outline-none"
              style={{ height: responsive.isSmall ? 48 : 52 }}
              data-vc-focusable
            >
              <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-btn font-semibold">{t.welcome.buy}</span>
            </button>
            <button
              onClick={onResellerPlans}
              className="wel-btn-ghost w-full flex items-center justify-center gap-2 focus:outline-none"
              style={{ height: responsive.isSmall ? 48 : 52 }}
              data-vc-focusable
            >
              <Store className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-btn font-semibold">{t.welcome.resell}</span>
            </button>
          </div>
            <div className="mt-6 text-center px-2">
              <p className="wel-legal">
                {t.welcome.termsAcceptance}{' '}
                <button
                  onClick={() => {
                    const url = 'https://web.jhservices.com.ar/terminos-y-condiciones';
                    if (window.DtStartWebViewActivity) window.DtStartWebViewActivity.execute(url);
                    else if (window.DtOpenWebview) window.DtOpenWebview.execute(url);
                    else window.open(url,'_blank');
                  }}
                  className="underline"
                >
                  {t.welcome.termsAndConditions}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <VirtualCursorOverlay cursor={cursor} />
    </GradientScreenLayout>
  );
};
