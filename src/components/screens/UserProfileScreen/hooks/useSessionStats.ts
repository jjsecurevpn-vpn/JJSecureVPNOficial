/**
 * @file useSessionStats.ts
 * @description Hook para recolectar estadísticas de la sesión / entorno cuando la VPN está conectada.
 *              Usa APIs nativas disponibles (ping, ip local, nombre de red, bytes up/down) si existen.
 */

import { useEffect, useState, useRef } from "react";
import { useUnifiedVpn } from "../../../../hooks/useUnifiedVpn";

interface SessionStatsState {
  ping: number | null;
  localIP: string | null;
  networkName: string | null;
  downloadBytes: number | null;
  uploadBytes: number | null;
  updatedAt: number | null;
  downloadRate: number | null; // bytes/seg
  uploadRate: number | null;   // bytes/seg
}

const formatBytes = (bytes: number | null): string => {
  if (bytes == null) return "-";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
};

export function useSessionStats(pollInterval = 5000) {
  const { isConnected } = useUnifiedVpn();
  const [stats, setStats] = useState<SessionStatsState>({
    ping: null,
    localIP: null,
    networkName: null,
    downloadBytes: null,
    uploadBytes: null,
    updatedAt: null,
    downloadRate: null,
    uploadRate: null,
  });
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
  const readStats = () => {
      try {
        const ping = (window as any).DtGetPingResult?.execute?.() ?? null;
        const localIP = (window as any).DtGetLocalIP?.execute?.() ?? null;
        const networkName = (window as any).DtGetNetworkName?.execute?.() ?? null;
        // Bytes pueden provenir de APIs de hotspot; si no están disponibles se ignoran
        const downloadBytes = (window as any).DtGetNetworkDownloadBytes?.execute?.() ?? null;
        const uploadBytes = (window as any).DtGetNetworkUploadBytes?.execute?.() ?? null;
        setStats(prev => {
          let downloadRate: number | null = null;
          let uploadRate: number | null = null;
          const now = Date.now();
          if (prev.downloadBytes != null && typeof downloadBytes === 'number' && prev.updatedAt) {
            const deltaBytes = downloadBytes - prev.downloadBytes;
            const deltaTime = (now - prev.updatedAt) / 1000; // s
            if (deltaTime > 0 && deltaBytes >= 0) downloadRate = deltaBytes / deltaTime;
          }
          if (prev.uploadBytes != null && typeof uploadBytes === 'number' && prev.updatedAt) {
            const deltaBytes = uploadBytes - prev.uploadBytes;
            const deltaTime = (now - prev.updatedAt) / 1000;
            if (deltaTime > 0 && deltaBytes >= 0) uploadRate = deltaBytes / deltaTime;
          }
          return {
            ping: typeof ping === 'number' ? ping : null,
            localIP: typeof localIP === 'string' ? localIP : null,
            networkName: typeof networkName === 'string' ? networkName : null,
            downloadBytes: typeof downloadBytes === 'number' ? downloadBytes : null,
            uploadBytes: typeof uploadBytes === 'number' ? uploadBytes : null,
            updatedAt: now,
            downloadRate,
            uploadRate,
          };
        });
      } catch {
        // Silencioso: no romper UI
      }
    };

    if (isConnected) {
      readStats();
      intervalRef.current = window.setInterval(readStats, pollInterval);
    } else {
  setStats({ ping: null, localIP: null, networkName: null, downloadBytes: null, uploadBytes: null, updatedAt: null, downloadRate: null, uploadRate: null });
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [isConnected, pollInterval]);

  return {
    ...stats,
    formatted: {
      download: formatBytes(stats.downloadBytes),
      upload: formatBytes(stats.uploadBytes),
      downloadRate: stats.downloadRate == null ? '—' : `${(stats.downloadRate / 1024).toFixed(1)} KB/s`,
      uploadRate: stats.uploadRate == null ? '—' : `${(stats.uploadRate / 1024).toFixed(1)} KB/s`,
    }
  };
}
