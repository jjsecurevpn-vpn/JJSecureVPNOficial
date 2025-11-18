// Limpieza total + versión pulida sólo modo "pulse" respetando los bordes difuminados.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSafeArea } from '../utils/deviceUtils';

export interface AdMessage {
  id: string;
  text: string;
  type?: 'info' | 'warn' | 'promo';
}

export const AD_TICKER_DEFAULT_HEIGHT = 22; // altura compacta

export interface AdTickerProps {
  messages?: AdMessage[];
  height?: number;
  pulseBlankMs?: number;    // Tiempo sin mostrar nada
  pulseDisplayMs?: number;  // Duración del desplazamiento horizontal
  fadeMs?: number;          // Duración fade in/out
  trackBlurPx?: number;     // Blur de la pista
  onMessageClick?: (msg: AdMessage) => void;
}

// Fases sin desplazamiento horizontal
type Phase = 'blank' | 'fading-in' | 'visible' | 'fading-out';

export function AdTicker({
  messages,
  height = AD_TICKER_DEFAULT_HEIGHT,
  pulseBlankMs = 30000,
  pulseDisplayMs = 9000,
  fadeMs = 280,
  trackBlurPx = 6,
  onMessageClick
}: AdTickerProps) {
  const { statusBarHeight } = useSafeArea();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const messageRef = useRef<HTMLButtonElement | null>(null);
  const phaseTimeoutRef = useRef<number | null>(null);
  const [phase, setPhase] = useState<Phase>('blank');
  const [index, setIndex] = useState(0);

  // Mensajes fallback
  const data = useMemo<AdMessage[]>(() => {
    if (messages && messages.length) return messages;
    // Mensajes por defecto solicitados
    return [
      { id: 'upd', text: 'Mantén la aplicación siempre actualizada', type: 'info' },
      { id: 'promo', text: 'Consulta las promociones en nuestros canales oficiales', type: 'promo' },
      { id: 'sec', text: 'No compartas tus credenciales con terceros', type: 'warn' },
      { id: 'legal', text: 'JJSecure VPN — Todos los derechos reservados', type: 'info' }
    ];
  }, [messages]);

  // Lanzar siguiente ciclo desde blank
  useEffect(() => {
    if (phase !== 'blank') return;
    if (phaseTimeoutRef.current) window.clearTimeout(phaseTimeoutRef.current);
    phaseTimeoutRef.current = window.setTimeout(() => setPhase('fading-in'), pulseBlankMs);
    return () => { if (phaseTimeoutRef.current) window.clearTimeout(phaseTimeoutRef.current); };
  }, [phase, pulseBlankMs]);

  // Control de fases sin movimiento (solo fade + permanencia centrada)
  useEffect(() => {
    const el = messageRef.current;
    if (!el) return;

    if (phase === 'fading-in') {
      el.style.transition = `opacity ${fadeMs}ms ease`;
      el.style.opacity = '1';
      if (phaseTimeoutRef.current) window.clearTimeout(phaseTimeoutRef.current);
      phaseTimeoutRef.current = window.setTimeout(() => setPhase('visible'), fadeMs);
      return;
    }

    if (phase === 'visible') {
      if (phaseTimeoutRef.current) window.clearTimeout(phaseTimeoutRef.current);
      phaseTimeoutRef.current = window.setTimeout(() => setPhase('fading-out'), pulseDisplayMs);
      return;
    }

    if (phase === 'fading-out') {
      el.style.transition = `opacity ${fadeMs}ms ease`;
      el.style.opacity = '0';
      if (phaseTimeoutRef.current) window.clearTimeout(phaseTimeoutRef.current);
      phaseTimeoutRef.current = window.setTimeout(() => {
        setIndex(i => (i + 1) % data.length);
        setPhase('blank');
      }, fadeMs);
      return;
    }
  }, [phase, fadeMs, pulseDisplayMs, data.length]);

  // Limpieza al desmontar
  useEffect(() => () => { if (phaseTimeoutRef.current) window.clearTimeout(phaseTimeoutRef.current); }, []);

  const current = data[index];
  const showTrack = phase !== 'blank';
  const interactive = phase === 'visible';

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: statusBarHeight + 2,
        left: 0,
        right: 0,
        height,
        zIndex: 950,
        padding: '0 16px',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%'
        }}
      >
        {showTrack && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(10,10,18,0) 0%, rgba(15,15,25,0.55) 12%, rgba(15,15,25,0.55) 88%, rgba(10,10,18,0) 100%)',
              backdropFilter: `blur(${trackBlurPx}px) saturate(150%)`,
              WebkitBackdropFilter: `blur(${trackBlurPx}px) saturate(150%)`,
              pointerEvents: 'none'
            }}
          />
        )}
        {current && (
          <button
            ref={messageRef}
            onClick={() => interactive && onMessageClick?.(current)}
            className="text-[11px] md:text-xs font-semibold tracking-wide focus:outline-none"
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              margin: 0,
              color: '#fff',
              textShadow: '0 0 4px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.55)',
              whiteSpace: 'nowrap',
              opacity: phase === 'fading-in' || phase === 'visible' ? 1 : 0,
              willChange: 'opacity',
              pointerEvents: interactive ? 'auto' : 'none'
            }}
          >
            {current.text}
          </button>
        )}
      </div>
    </div>
  );
}
