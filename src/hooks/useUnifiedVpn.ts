import { useEffect, useState, useCallback, useRef } from 'react';
import { nativeAPI } from '../utils';
import type { VpnState } from '../types/vpn';

export interface UnifiedVpnState {
  state: VpnState;
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnecting: boolean;
  hasError: boolean;
  lastChange: number;
  errorMessage: string | null;
}

const INITIAL: UnifiedVpnState = {
  state: 'DISCONNECTED',
  isConnected: false,
  isConnecting: false,
  isDisconnecting: false,
  hasError: false,
  lastChange: Date.now(),
  errorMessage: null
};

function deriveFlags(state: VpnState) {
  return {
    isConnected: state === 'CONNECTED',
    isConnecting: state === 'CONNECTING' || state === 'AUTH',
    isDisconnecting: state === 'STOPPING',
    hasError: state === 'AUTH_FAILED' || state === 'NO_NETWORK'
  };
}

export interface UseUnifiedVpnOptions {
  pollMs?: number; // polling de respaldo simplificado
}

export function useUnifiedVpn(opts: UseUnifiedVpnOptions = {}) {
  const { pollMs = 2000 } = opts; // Polling unificado más simple
  const [vpn, setVpn] = useState<UnifiedVpnState>(INITIAL);
  const mountedRef = useRef(true);
  const pollRef = useRef<any>(null);

  const applyState = useCallback((s: VpnState) => {
    setVpn(prev => {
      if (prev.state === s) return prev; // evitar renders innecesarios
      const flags = deriveFlags(s);
      return { ...prev, state: s, ...flags, lastChange: Date.now(), errorMessage: flags.hasError ? 'VPN error' : null };
    });
  }, []);

  // Suscripción directa al vpnAPI listener (ya conectado al evento nativo)
  useEffect(() => {
    mountedRef.current = true;
    const handler = (s: VpnState) => { if (mountedRef.current) applyState(s); };
    nativeAPI.vpn.onStateChange(handler);
    // estado inicial (cache o lectura)
    const initial = nativeAPI.vpn.getCachedState() || nativeAPI.vpn.getState();
    if (initial) applyState(initial);

    // Polling simplificado como respaldo
    if (pollMs > 0) {
      pollRef.current = setInterval(() => {
        const cur = nativeAPI.vpn.getCachedState() || nativeAPI.vpn.getState();
        if (cur) applyState(cur);
      }, pollMs);
    }

    return () => {
      mountedRef.current = false;
      nativeAPI.vpn.offStateChange(handler);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [applyState, pollMs]);

  const connect = useCallback(async () => {
    // Optimismo inmediato: mostrar CONNECTING antes del evento nativo
    if (vpn.state === 'DISCONNECTED' || vpn.state === 'AUTH_FAILED' || vpn.state === 'NO_NETWORK') {
      applyState('CONNECTING');
    }
    const result = await nativeAPI.vpn.connect();
    return result;
  }, [applyState, vpn.state]);

  const disconnect = useCallback(() => {
    // Optimismo inmediato: mostrar STOPPING antes del evento nativo
    if (vpn.state === 'CONNECTED' || vpn.state === 'CONNECTING' || vpn.state === 'AUTH') {
      applyState('STOPPING');
    }
    nativeAPI.vpn.stop();
  }, [applyState, vpn.state]);

  return {
    ...vpn,
    connect,
    disconnect,
    start: connect,
    stop: disconnect
  };
}

export default useUnifiedVpn;