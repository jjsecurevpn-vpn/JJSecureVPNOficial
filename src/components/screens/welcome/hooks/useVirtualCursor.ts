import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook de cursor virtual controlado por teclado (flechas/WASD).
 * Implementación simple y confiable: se mueve cada frame mientras la tecla está abajo
 * detectando el estado real mediante keydown/keyup y evitando depender de auto-repeat.
 */
export interface VirtualCursorOptions {
  initial?: { x: number; y: number };
  speed?: number;            // px/s base
  maxFactor?: number;        // multiplicador máximo tras aceleración
  accelMs?: number;          // ms hasta velocidad máxima
  precisionFactor?: number;  // factor cuando está activo el modo precisión (Shift/Alt)
  enable?: boolean;          // permitir activación
}

export interface VirtualCursorApi {
  active: boolean;
  position: { x: number; y: number };
  hint: string;
  enable: () => void;
  disable: () => void;
  center: () => void;
  debug: boolean;
  toggleDebug: () => void;
  precision: boolean;
}

export function useVirtualCursor(opts: VirtualCursorOptions = {}): VirtualCursorApi {
  const {
    initial = { x: 120, y: 160 },
    speed = 520,
    maxFactor = 1.9,
    accelMs = 400,
    precisionFactor = 0.35,
    enable = true,
  } = opts;

  const [active, setActive] = useState(false);
  const [pos, setPos] = useState(initial);
  const [debug, setDebug] = useState(false);
  const [precision, setPrecision] = useState(false);

  const stateRef = useRef({
    keys: new Set<string>(),
    lastTs: 0,
    raf: 0 as number | 0,
    holdStart: 0,
    speedFactor: 1,
    precision: false,
  });
  const activeRef = useRef(false);

  const clamp = useCallback((x:number,y:number) => {
    const m = 4;
    const maxX = window.innerWidth - 22 - m;
    const maxY = window.innerHeight - 22 - m;
    return { x: Math.min(Math.max(m,x), maxX), y: Math.min(Math.max(m,y), maxY) };
  }, []);

  const center = useCallback(() => {
    const cx = Math.round(window.innerWidth / 2 - 11);
    const cy = Math.round(window.innerHeight / 2 - 11);
    setPos(clamp(cx, cy));
  }, [clamp]);

  const enableCursor = useCallback(() => {
    if (!enable) return;
    if (!activeRef.current) {
      setActive(true);
      activeRef.current = true;
      center();
  // Hint temporal removido; UI puede manejar mensajes si lo necesita
    }
  }, [enable, center]);

  const disableCursor = useCallback(() => {
    activeRef.current = false;
    setActive(false);
    stateRef.current.keys.clear();
    if (stateRef.current.raf) cancelAnimationFrame(stateRef.current.raf);
    stateRef.current.raf = 0;
    stateRef.current.precision = false;
    setPrecision(false);
  }, []);

  const step = useCallback(function stepLoop(ts: number) {
    if (!activeRef.current) { stateRef.current.raf = 0; return; }
    if (!stateRef.current.lastTs) stateRef.current.lastTs = ts;
    const dt = ts - stateRef.current.lastTs;
    stateRef.current.lastTs = ts;

    const st = stateRef.current;
    if (st.keys.size) {
      if (!st.holdStart) st.holdStart = ts;
      const held = ts - st.holdStart;
      st.speedFactor = 1 + (Math.min(held, accelMs)/accelMs) * (maxFactor - 1);
      let vx = 0, vy = 0;
      if (st.keys.has('left')) vx -= 1;
      if (st.keys.has('right')) vx += 1;
      if (st.keys.has('up')) vy -= 1;
      if (st.keys.has('down')) vy += 1;
      if (vx || vy) {
        if (vx && vy) { const k = Math.SQRT1_2; vx*=k; vy*=k; }
        const effSpeed = speed * st.speedFactor * (st.precision ? precisionFactor : 1);
        const dx = vx * effSpeed * (dt/1000);
        const dy = vy * effSpeed * (dt/1000);
        setPos(prev => clamp(prev.x + dx, prev.y + dy));
      }
    } else {
      st.holdStart = 0;
      st.speedFactor = 1;
    }
    st.raf = requestAnimationFrame(stepLoop);
  }, [accelMs, clamp, maxFactor, precisionFactor, speed]);

  // Key handlers (usa claves normalizadas internas: up/down/left/right)
  useEffect(() => {
    if (!enable) return;
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (['arrowup','w'].includes(k)) { e.preventDefault(); enableCursor(); stateRef.current.keys.add('up'); }
      else if (['arrowdown','s'].includes(k)) { e.preventDefault(); enableCursor(); stateRef.current.keys.add('down'); }
      else if (['arrowleft','a'].includes(k)) { e.preventDefault(); enableCursor(); stateRef.current.keys.add('left'); }
      else if (['arrowright','d'].includes(k)) { e.preventDefault(); enableCursor(); stateRef.current.keys.add('right'); }
      else if (activeRef.current && (k === 'enter' || k === ' ')) {
        // Click simulado externo: el componente que use el hook disparará
        const evt = new CustomEvent('virtual-cursor-click');
        window.dispatchEvent(evt);
      } else if (activeRef.current && k === 'escape') {
        disableCursor();
      } else if (activeRef.current && k === '0') {
        center();
      } else if (activeRef.current && k === 'd') {
        setDebug(v=>!v);
      } else if (k === 'shift' || k === 'alt') {
        if (!stateRef.current.precision) {
          stateRef.current.precision = true;
          setPrecision(true);
        }
      }
      if (activeRef.current && !stateRef.current.raf) {
        stateRef.current.lastTs = 0;
        stateRef.current.raf = requestAnimationFrame(step);
      }
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === 'shift' || k === 'alt') { 
        stateRef.current.precision = false; 
        setPrecision(false);
        return; 
      }
      if (['arrowup','w'].includes(k)) stateRef.current.keys.delete('up');
      else if (['arrowdown','s'].includes(k)) stateRef.current.keys.delete('down');
      else if (['arrowleft','a'].includes(k)) stateRef.current.keys.delete('left');
      else if (['arrowright','d'].includes(k)) stateRef.current.keys.delete('right');
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [enable, enableCursor, disableCursor, center, accelMs, maxFactor, speed, precisionFactor, step]);

  useEffect(() => {
    activeRef.current = active;
    document.body.classList.toggle('virtual-cursor-active', active);
    if (!active && stateRef.current.raf) {
      cancelAnimationFrame(stateRef.current.raf);
      stateRef.current.raf = 0;
    }
  }, [active]);

  return {
    active,
    position: pos,
    hint: active ? 'Enter/Espacio=Click • ESC=Ocultar • 0=Centrar • Shift/Alt=Precisión • D=Debug' : 'Flechas o WASD para activar cursor (Shift=precisión)',
    enable: enableCursor,
    disable: disableCursor,
    center,
    debug,
    toggleDebug: () => setDebug(v=>!v),
    precision,
  };
}
