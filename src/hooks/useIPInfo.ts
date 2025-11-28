import { useCallback, useEffect, useRef, useState } from "react";
import type { VpnState } from "../types/vpn";
import { nativeAPI } from "../utils/unifiedNativeAPI";

/**
 * Contrato del hook unificado de IP
 * - localIP: IP interna del dispositivo (DtGetLocalIP)
 * - vpnIP: IP del túnel (DtGetVpnIP / DtGetExternalIP / DtGetHysteriaIP) o null si no disponible
 * - displayIP: IP prioritaria para UI (vpnIP si conectado, si no localIP)
 * - ipLabel: Etiqueta contextual ("IP VPN" | "Conectando" | "IP Local")
 * - isLoading: True mientras se resuelve la primera muestra o durante transición de estado
 * - lastUpdated: timestamp de la última actualización (ms epoch)
 * - refresh: fuerza actualización inmediata
 * - sources: metadatos de origen para debug
 */
export interface UseIPInfoResult {
  localIP: string;
  vpnIP: string | null;
  displayIP: string;
  ipLabel: string;
  isLoading: boolean;
  lastUpdated: number;
  refresh: () => void;
  sources: { local: string; vpn: string | null };
}

// Utilidades internas -------------------------------------------------------

function safeGetLocalIP(): string {
  try {
    return nativeAPI.network.getLocalIP();
  } catch {
    return "127.0.0.1";
  }
}

function tryExecute(fn: { execute?: () => string | null } | undefined): string | null {
  try {
    const v = fn?.execute?.();
    if (!v || typeof v !== "string") return null;
    if (v === "0.0.0.0" || v.trim() === "") return null;
    return v.trim();
  } catch {
    return null;
  }
}

// Estrategia jerárquica para obtener VPN IP (la primera válida) -----------
function resolveVpnIP(): { ip: string | null; source: string | null } {
  // Simulación (modo desarrollo) ------------------------------------------
  const w = window as unknown as Record<string, unknown>;
  const simulated = w.__vpnIPSimulation as string | undefined;
  if (simulated) return { ip: simulated, source: "simulation" };

  // 1. API unificada si existiese (nativeAPI.network.getVpnIP) ------------
  try {
    const nativeAny = nativeAPI as unknown as { network?: { getVpnIP?: () => string | null } };
    const direct = nativeAny.network?.getVpnIP?.();
    if (direct && typeof direct === "string" && direct !== "0.0.0.0") {
      return { ip: direct, source: "nativeAPI.network.getVpnIP" };
    }
  } catch {/* ignore */}

  // 2. Funciones nativas específicas (orden de prioridad) -----------------
  const candidates: Array<[string, string | null]> = [
    ["DtGetVpnIP", tryExecute((w.DtGetVpnIP as { execute?: () => string | null } | undefined))],
    ["DtGetHysteriaIP", tryExecute((w.DtGetHysteriaIP as { execute?: () => string | null } | undefined))],
    ["DtGetExternalIP", tryExecute((w.DtGetExternalIP as { execute?: () => string | null } | undefined))],
    ["DtGetHysteriaTunnelIP", tryExecute((w.DtGetHysteriaTunnelIP as { execute?: () => string | null } | undefined))],
  ];

  for (const [name, val] of candidates) {
    if (val) return { ip: val, source: name };
  }

  return { ip: null, source: null };
}

function computeLabel(vpnState: VpnState | undefined, vpnIP: string | null): string {
  if (!vpnState) return "IP Local";
  switch (vpnState) {
    case "CONNECTED":
      return vpnIP ? "IP VPN" : "IP VPN"; // Mantener etiqueta aun si ip null para consistencia UI
    case "CONNECTING":
    case "AUTH":
      return "Conectando";
    default:
      return "IP Local";
  }
}

function computeDisplayIP(vpnState: VpnState | undefined, localIP: string, vpnIP: string | null): string {
  if (vpnState === "CONNECTED" && vpnIP) return vpnIP;
  if (vpnState === "CONNECTING" || vpnState === "AUTH") return "Obteniendo IP...";
  return localIP || "Sin conexión";
}

// Hook principal -----------------------------------------------------------
export function useIPInfo(vpnState?: VpnState): UseIPInfoResult {
  const [state, setState] = useState({
    localIP: "127.0.0.1",
    vpnIP: null as string | null,
    ipLabel: "IP Local",
    displayIP: "Detectando...",
    isLoading: true,
    lastUpdated: 0,
  });
  const lastUpdatedRef = useRef(0);
  const sourcesRef = useRef<{ local: string; vpn: string | null }>({ local: "DtGetLocalIP", vpn: null });
  const intervalRef = useRef<number | null>(null);
  const unmountedRef = useRef(false);
  const vpnStateRef = useRef(vpnState);
  
  // Mantener referencia actualizada del estado VPN
  vpnStateRef.current = vpnState;

  const update = useCallback(() => {
    if (unmountedRef.current) return;
    // Evitar actualizaciones redundantes dentro del mismo tick rápido (<200ms)
    const now = Date.now();
    if (lastUpdatedRef.current && (now - lastUpdatedRef.current) < 200) {
      return; // throttle para prevenir loops accidentales
    }
    try {
      const lIP = safeGetLocalIP();
      const { ip: tunnel, source } = resolveVpnIP();
      sourcesRef.current = { local: "DtGetLocalIP", vpn: source };
      const currentVpnState = vpnStateRef.current;
      const newLabel = computeLabel(currentVpnState, tunnel);
      const newDisplay = computeDisplayIP(currentVpnState, lIP, tunnel);
      
      // Actualización consolidada - solo un setState
      setState(prev => {
        // Verificar si hay cambios reales
        if (
          prev.localIP === lIP &&
          prev.vpnIP === tunnel &&
          prev.ipLabel === newLabel &&
          prev.displayIP === newDisplay
        ) {
          return prev; // Sin cambios, evitar re-render
        }
        return {
          localIP: lIP,
          vpnIP: tunnel,
          ipLabel: newLabel,
          displayIP: newDisplay,
          isLoading: false,
          lastUpdated: now,
        };
      });
      lastUpdatedRef.current = now;
    } catch {
      // Error silencioso
    }
  }, []);

  const refresh = useCallback(() => {
    update();
  }, [update]);

  // Configurar polling adaptativo (simplificado respecto al hook previo)
  useEffect(() => {
    unmountedRef.current = false;
    if (intervalRef.current) window.clearInterval(intervalRef.current);

    update(); // primera actualización inmediata

    // Decidir frecuencia básica
    let freq = 10000; // base 10s
    if (vpnState === "CONNECTING" || vpnState === "AUTH") freq = 1500;
    else if (vpnState === "CONNECTED") freq = 5000;

    intervalRef.current = window.setInterval(update, freq);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [vpnState, update]);

  // Cleanup desmontaje
  useEffect(() => () => { unmountedRef.current = true; if (intervalRef.current) window.clearInterval(intervalRef.current); }, []);

  return {
    localIP: state.localIP,
    vpnIP: state.vpnIP,
    displayIP: state.displayIP,
    ipLabel: state.ipLabel,
    isLoading: state.isLoading,
    lastUpdated: state.lastUpdated,
    refresh,
    sources: sourcesRef.current,
  };
}

// Nota: Este hook reemplaza al antiguo `useVpnIP` (eliminado tras refactor de IP unificada).
