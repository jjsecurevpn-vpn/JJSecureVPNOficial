import { useEffect, useRef, useState } from 'react';
import { nativeAPI } from '../utils';
import { formatSpeed } from '../utils/formatUtils';

/**
 * useNetSpeeds
 * Hook simplificado para obtener velocidades de red (KB/s) directamente de los contadores de bytes nativos.
 * - Lee bytes acumulados usando DtGetNetworkDownloadBytes / DtGetNetworkUploadBytes.
 * - Calcula delta en cada tick.
 * - Incluye smoothing EMA configurable (alpha) y decaimiento suave cuando no hay tráfico.
 * - No mantiene estado global oculto; todo es local al hook.
 */
export interface NetSpeedsResult {
  downloadKBps: number;
  uploadKBps: number;
  bytes: { download: number; upload: number };
  isSimulated: boolean;
  formatted: { download: string; upload: string };
}

export interface UseNetSpeedsOptions {
  enabled?: boolean;          // activar/desactivar medición
  intervalMs?: number;        // intervalo de muestreo (ms)
  alpha?: number;             // factor EMA (0-1)
  decayWhenZeroMs?: number;   // ventana para aplicar decaimiento suave
  minChangeRatio?: number;    // umbral de cambio mínimo para disparar render
  minIntervalUpdateMs?: number; // throttle mínimo entre sets
}

const DEFAULT_OPTS: Required<Omit<UseNetSpeedsOptions, 'enabled'>> = {
  intervalMs: 1000,
  alpha: 0.35,
  decayWhenZeroMs: 1500,
  minChangeRatio: 0.01,
  minIntervalUpdateMs: 250
};

export function useNetSpeeds(opts: UseNetSpeedsOptions = {}): NetSpeedsResult {
  const {
    enabled = true,
    intervalMs = DEFAULT_OPTS.intervalMs,
    alpha = DEFAULT_OPTS.alpha,
    decayWhenZeroMs = DEFAULT_OPTS.decayWhenZeroMs,
    minChangeRatio = DEFAULT_OPTS.minChangeRatio,
    minIntervalUpdateMs = DEFAULT_OPTS.minIntervalUpdateMs
  } = opts;

  const [state, setState] = useState<NetSpeedsResult>({
    downloadKBps: 0,
    uploadKBps: 0,
    bytes: { download: 0, upload: 0 },
    isSimulated: false,
    formatted: { download: '0 B/s', upload: '0 B/s' }
  });

  const lastBytesRef = useRef<{ download: number; upload: number }>({ download: 0, upload: 0 });
  const lastTimestampRef = useRef<number>(0);
  const lastSmoothedRef = useRef<{ d: number; u: number }>({ d: 0, u: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSetRef = useRef<number>(0);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      initializedRef.current = false;
      setState((prev) => ({
        downloadKBps: 0,
        uploadKBps: 0,
        bytes: { download: 0, upload: 0 },
        isSimulated: prev.isSimulated,
        formatted: { download: '0 B/s', upload: '0 B/s' }
      }));
      return;
    }

    // Reset local
    initializedRef.current = false;

    const sample = () => {
      try {
        const now = Date.now();
        const downloadBytes = nativeAPI.network.getDownloadBytes();
        const uploadBytes = nativeAPI.network.getUploadBytes();

        if (!initializedRef.current) {
          lastBytesRef.current = { download: downloadBytes, upload: uploadBytes };
          lastTimestampRef.current = now;
          lastSmoothedRef.current = { d: 0, u: 0 };
          initializedRef.current = true;
          lastSetRef.current = now;
          setState({
            downloadKBps: 0,
            uploadKBps: 0,
            bytes: { download: downloadBytes, upload: uploadBytes },
            isSimulated: false,
            formatted: { download: '0 B/s', upload: '0 B/s' }
          });
          return;
        }

        const elapsedMs = Math.max(1, now - lastTimestampRef.current);
        const dDiff = Math.max(0, downloadBytes - lastBytesRef.current.download);
        const uDiff = Math.max(0, uploadBytes - lastBytesRef.current.upload);

        const dBps = (dDiff * 1000) / elapsedMs;
        const uBps = (uDiff * 1000) / elapsedMs;

        let dKBps = dBps / 1024;
        let uKBps = uBps / 1024;

        // Smoothing EMA
        if (lastSmoothedRef.current.d > 0 || lastSmoothedRef.current.u > 0) {
          dKBps = alpha * dKBps + (1 - alpha) * lastSmoothedRef.current.d;
          uKBps = alpha * uKBps + (1 - alpha) * lastSmoothedRef.current.u;
        }

        // Decaimiento suave si no hay tráfico y dentro de ventana
        if (dDiff === 0 && (now - lastSetRef.current) < decayWhenZeroMs) {
          dKBps = lastSmoothedRef.current.d * 0.85;
        }
        if (uDiff === 0 && (now - lastSetRef.current) < decayWhenZeroMs) {
          uKBps = lastSmoothedRef.current.u * 0.85;
        }

        // Umbral de cambio mínimo y throttle temporal
        const changeRatioD = lastSmoothedRef.current.d === 0 ? 1 : Math.abs(dKBps - lastSmoothedRef.current.d) / (lastSmoothedRef.current.d || 1);
        const changeRatioU = lastSmoothedRef.current.u === 0 ? 1 : Math.abs(uKBps - lastSmoothedRef.current.u) / (lastSmoothedRef.current.u || 1);
        const nowSinceLastSet = now - lastSetRef.current;
        if (nowSinceLastSet < minIntervalUpdateMs && changeRatioD < minChangeRatio && changeRatioU < minChangeRatio) {
          // No actualizar para evitar renders innecesarios
          lastBytesRef.current = { download: downloadBytes, upload: uploadBytes };
          lastTimestampRef.current = now;
          return;
        }

        lastBytesRef.current = { download: downloadBytes, upload: uploadBytes };
        lastTimestampRef.current = now;
        lastSmoothedRef.current = { d: dKBps, u: uKBps };
        lastSetRef.current = now;

        setState({
          downloadKBps: dKBps,
            uploadKBps: uKBps,
            bytes: { download: downloadBytes, upload: uploadBytes },
          isSimulated: false,
          formatted: { download: formatSpeed(dKBps * 1024), upload: formatSpeed(uKBps * 1024) }
        });
      } catch (e) {
        setState((prev) => ({
          downloadKBps: 0,
          uploadKBps: 0,
          bytes: prev.bytes,
          isSimulated: true,
          formatted: { download: '0 B/s', upload: '0 B/s' }
        }));
      }
    };

    sample(); // primer tick
    intervalRef.current = setInterval(sample, Math.max(100, intervalMs));

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, intervalMs, alpha, decayWhenZeroMs, minChangeRatio, minIntervalUpdateMs]);

  return state;
}
