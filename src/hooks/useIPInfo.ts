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

function tryExecute(fn: any): string | null {
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
  const simulated = (window as any).__vpnIPSimulation;
  if (simulated) return { ip: simulated, source: "simulation" };

  // 1. API unificada si existiese (nativeAPI.network.getVpnIP) ------------
  try {
    const direct = (nativeAPI as any).network?.getVpnIP?.();
    if (direct && typeof direct === "string" && direct !== "0.0.0.0") {
      return { ip: direct, source: "nativeAPI.network.getVpnIP" };
    }
  } catch {/* ignore */}

  // 2. Funciones nativas específicas (orden de prioridad) -----------------
  const candidates: Array<[string, string | null]> = [
    ["DtGetVpnIP", tryExecute((window as any).DtGetVpnIP)],
    ["DtGetHysteriaIP", tryExecute((window as any).DtGetHysteriaIP)],
    ["DtGetExternalIP", tryExecute((window as any).DtGetExternalIP)],
    ["DtGetHysteriaTunnelIP", tryExecute((window as any).DtGetHysteriaTunnelIP)],
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
  const [localIP, setLocalIP] = useState<string>("127.0.0.1");
  const [vpnIP, setVpnIP] = useState<string | null>(null);
  const [ipLabel, setIpLabel] = useState<string>("IP Local");
  const [displayIP, setDisplayIP] = useState<string>("Detectando...");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<number>(0);
  const lastUpdatedRef = useRef(0);
  const sourcesRef = useRef<{ local: string; vpn: string | null }>({ local: "DtGetLocalIP", vpn: null });
  const intervalRef = useRef<number | null>(null);
  const unmountedRef = useRef(false);

  const update = useCallback(() => {
    if (unmountedRef.current) return;
    // Evitar actualizaciones redundantes dentro del mismo tick rápido (<150ms)
    const now = Date.now();
    if (lastUpdatedRef.current && (now - lastUpdatedRef.current) < 150) {
      return; // throttle para prevenir loops accidentales
    }
    try {
      if (lastUpdatedRef.current === 0) setIsLoading(true);
      const lIP = safeGetLocalIP();
      const { ip: tunnel, source } = resolveVpnIP();
      // Solo setState si cambió algo relevante para reducir renders
      setLocalIP(prev => (prev !== lIP ? lIP : prev));
      setVpnIP(prev => (prev !== tunnel ? tunnel : prev));
      sourcesRef.current = { local: "DtGetLocalIP", vpn: source };
      const newLabel = computeLabel(vpnState, tunnel);
      setIpLabel(prev => (prev !== newLabel ? newLabel : prev));
      const newDisplay = computeDisplayIP(vpnState, lIP, tunnel);
      setDisplayIP(prev => (prev !== newDisplay ? newDisplay : prev));
      lastUpdatedRef.current = now;
      setLastUpdated(now);
    } finally {
      if (lastUpdatedRef.current !== 0) setIsLoading(false);
    }
  }, [vpnState]);

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
    localIP,
    vpnIP,
    displayIP,
    ipLabel,
    isLoading,
    lastUpdated,
    refresh,
    sources: sourcesRef.current,
  };
}

// Nota: Este hook reemplaza al antiguo `useVpnIP` (eliminado tras refactor de IP unificada).
