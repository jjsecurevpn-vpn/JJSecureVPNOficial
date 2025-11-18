/**
 * @file useHotspotEvents.ts
 * @description Hook para eventos de hotspot con sincronización automática
 */

import { useState, useEffect, useCallback } from 'react';
import { nativeAPI } from '../utils';

export interface HotspotEventState {
  state: 'RUNNING' | 'STOPPED';
  isActive: boolean;
  lastStateChange: Date | null;
}

/**
 * Hook que se sincroniza automáticamente con eventos de hotspot
 * Nota: Usa polling lento (5s) ya que no existe evento DtHotspotStateEvent en la API nativa
 * El estado principal se maneja con estado optimista en useHotspot
 */
export function useHotspotEvents() {
  const [hotspotState, setHotspotState] = useState<HotspotEventState>({
    state: 'STOPPED',
    isActive: false,
    lastStateChange: null
  });

  const checkHotspotStatus = useCallback(() => {
    const status = nativeAPI.hotspot.getStatus();
    const state = status === 'RUNNING' ? 'RUNNING' : 'STOPPED';
    
    setHotspotState(prev => {
      // Solo actualizar si cambió el estado
      if (prev.state !== state) {
        return {
          state,
          isActive: state === 'RUNNING',
          lastStateChange: new Date()
        };
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    // Verificar estado inicial
    checkHotspotStatus();
    
    // Polling lento cada 5 segundos (evita parpadeos innecesarios)
    const interval = setInterval(checkHotspotStatus, 5000);
    
    return () => clearInterval(interval);
  }, [checkHotspotStatus]);

  return hotspotState;
}
