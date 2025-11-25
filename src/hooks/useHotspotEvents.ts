/**
 * @file useHotspotEvents.ts
 * @description Hook para eventos de hotspot con sincronización automática
 */

import { useState, useEffect } from 'react';
import { onDtunnelEvent } from '../utils';

export interface HotspotEventState {
  state: 'RUNNING' | 'STOPPED';
  isActive: boolean;
  lastStateChange: Date | null;
}

/**
 * Hook que se sincroniza automáticamente con eventos de hotspot
 */
export function useHotspotEvents() {
  const [hotspotState, setHotspotState] = useState<HotspotEventState>({
    state: 'STOPPED',
    isActive: false,
    lastStateChange: null
  });

  useEffect(() => {
    const unsubscribe = onDtunnelEvent('DtHotspotStateEvent', (stateData) => {
      setHotspotState({
        state: stateData.state,
        isActive: stateData.state === 'RUNNING',
        lastStateChange: new Date()
      });
    });

    return unsubscribe;
  }, []);

  return hotspotState;
}

/**
 * Hook simplificado que solo retorna si está activo
 */
export function useHotspotActive() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const unsubscribe = onDtunnelEvent('DtHotspotStateEvent', (stateData) => {
      setIsActive(stateData.state === 'RUNNING');
    });

    return unsubscribe;
  }, []);

  return isActive;
}
