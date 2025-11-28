/**
 * @file useHotspotEvents.ts
 * @description Hook para eventos de hotspot con polling automático como fallback
 * 
 * NOTA: Las APIs nativas de DTunnel no proporcionan eventos de cambio de estado
 * para el hotspot. Este hook usa polling como mecanismo principal para detectar
 * cambios de estado, con soporte para eventos nativos si se implementan en el futuro.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { onDtunnelEvent, nativeAPI } from '../utils';

export type HotspotStateValue = 'RUNNING' | 'STOPPED';

export interface HotspotEventState {
  state: HotspotStateValue;
  isActive: boolean;
  lastStateChange: Date | null;
  lastPollTime: Date | null;
}

/**
 * Obtiene el estado actual del hotspot desde la API nativa
 */
function getHotspotStatus(): HotspotStateValue {
  try {
    const status = nativeAPI.hotspot.getStatus();
    return status === 'RUNNING' ? 'RUNNING' : 'STOPPED';
  } catch {
    return 'STOPPED';
  }
}

/**
 * Hook que se sincroniza con el estado del hotspot mediante polling
 * y escucha eventos nativos como fallback
 * 
 * @param pollingInterval - Intervalo de polling en ms (default: 2000ms)
 */
export function useHotspotEvents(pollingInterval = 2000): HotspotEventState {
  const [hotspotState, setHotspotState] = useState<HotspotEventState>(() => ({
    state: getHotspotStatus(),
    isActive: getHotspotStatus() === 'RUNNING',
    lastStateChange: null,
    lastPollTime: new Date()
  }));

  const previousStateRef = useRef<HotspotStateValue>(hotspotState.state);
  const mountedRef = useRef(true);

  // Función para actualizar el estado
  const updateState = useCallback((newState: HotspotStateValue) => {
    if (!mountedRef.current) return;
    
    setHotspotState(prev => {
      const stateChanged = prev.state !== newState;
      return {
        state: newState,
        isActive: newState === 'RUNNING',
        lastStateChange: stateChanged ? new Date() : prev.lastStateChange,
        lastPollTime: new Date()
      };
    });

    if (previousStateRef.current !== newState) {
      previousStateRef.current = newState;
      console.log(`[useHotspotEvents] Estado detectado: ${newState}`);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    // Verificar estado inicial
    const initialState = getHotspotStatus();
    updateState(initialState);

    // Configurar polling
    const pollInterval = setInterval(() => {
      if (!mountedRef.current) return;
      const currentState = getHotspotStatus();
      updateState(currentState);
    }, pollingInterval);

    // También escuchar eventos nativos (por si se implementan en el futuro)
    const unsubscribe = onDtunnelEvent('DtHotspotStateEvent', (stateData) => {
      if (stateData && typeof stateData === 'object' && 'state' in stateData) {
        updateState(stateData.state as HotspotStateValue);
      }
    });

    return () => {
      mountedRef.current = false;
      clearInterval(pollInterval);
      unsubscribe();
    };
  }, [pollingInterval, updateState]);

  return hotspotState;
}

/**
 * Hook simplificado que solo retorna si está activo
 * Usa polling para mantener el estado actualizado
 * 
 * @param pollingInterval - Intervalo de polling en ms (default: 2000ms)
 */
export function useHotspotActive(pollingInterval = 2000): boolean {
  const [isActive, setIsActive] = useState(() => getHotspotStatus() === 'RUNNING');
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    // Verificar estado inicial
    setIsActive(getHotspotStatus() === 'RUNNING');

    // Configurar polling
    const pollInterval = setInterval(() => {
      if (!mountedRef.current) return;
      setIsActive(getHotspotStatus() === 'RUNNING');
    }, pollingInterval);

    // También escuchar eventos nativos
    const unsubscribe = onDtunnelEvent('DtHotspotStateEvent', (stateData) => {
      if (stateData && typeof stateData === 'object' && 'state' in stateData) {
        setIsActive(stateData.state === 'RUNNING');
      }
    });

    return () => {
      mountedRef.current = false;
      clearInterval(pollInterval);
      unsubscribe();
    };
  }, [pollingInterval]);

  return isActive;
}
