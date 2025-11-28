import { useState, useCallback, useEffect, useRef } from "react";
import { nativeAPI } from "../utils";

export type HotspotState = 'RUNNING' | 'STOPPED' | 'STARTING' | 'STOPPING' | 'UNKNOWN';

/**
 * Obtiene el estado actual del hotspot desde la API nativa (función pura)
 */
function getNativeHotspotStatus(): HotspotState {
  try {
    const nativeStatus = nativeAPI.hotspot.getStatus();
    console.log('[useHotspot] Estado nativo obtenido:', nativeStatus);
    
    if (nativeStatus === 'RUNNING') return 'RUNNING';
    if (nativeStatus === 'STOPPED') return 'STOPPED';
    
    return 'STOPPED'; // Por defecto asumimos STOPPED en lugar de UNKNOWN
  } catch (err) {
    console.warn('[useHotspot] Error al obtener estado nativo:', err);
    return 'STOPPED';
  }
}

export interface UseHotspotReturn {
  /** Estado actual del hotspot */
  state: HotspotState;
  /** Si el hotspot está activo (RUNNING) */
  isEnabled: boolean;
  /** Si hay una operación en progreso */
  loading: boolean;
  /** Último error ocurrido */
  error: string | null;
  /** Fecha del último cambio de estado */
  lastStateChange: Date | null;
  /** Iniciar el hotspot */
  startHotspot: () => Promise<boolean>;
  /** Detener el hotspot */
  stopHotspot: () => Promise<boolean>;
  /** Alternar el estado del hotspot */
  toggleHotspot: () => Promise<boolean>;
  /** Forzar verificación del estado */
  checkStatus: () => HotspotState;
  /** Forzar refresco del estado desde la API nativa */
  refresh: () => void;
}

/**
 * Hook mejorado para control del Hotspot VPN
 * 
 * Este hook maneja el estado del hotspot mediante polling activo
 * ya que las APIs nativas no proporcionan eventos de cambio de estado.
 * 
 * @param pollingInterval - Intervalo de polling en ms (default: 1500ms)
 * @returns Objeto con estado y funciones de control del hotspot
 */
export function useHotspot(pollingInterval = 1500): UseHotspotReturn {
  // Inicializar con el estado real desde el inicio
  const [state, setState] = useState<HotspotState>(() => getNativeHotspotStatus());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastStateChange, setLastStateChange] = useState<Date | null>(null);
  
  const pollingRef = useRef<number | null>(null);
  const operationTimeoutRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  /**
   * Obtiene el estado actual del hotspot desde la API nativa
   */
  const fetchNativeStatus = useCallback((): HotspotState => {
    return getNativeHotspotStatus();
  }, []);

  /**
   * Actualiza el estado y registra cambios
   */
  const updateState = useCallback((newState: HotspotState) => {
    if (!mountedRef.current) return;
    
    setState(prevState => {
      if (prevState !== newState) {
        setLastStateChange(new Date());
        console.log(`[useHotspot] Estado cambiado: ${prevState} → ${newState}`);
      }
      return newState;
    });
  }, []);

  /**
   * Verifica el estado del hotspot
   */
  const checkStatus = useCallback((): HotspotState => {
    const currentStatus = fetchNativeStatus();
    updateState(currentStatus);
    return currentStatus;
  }, [fetchNativeStatus, updateState]);

  /**
   * Fuerza un refresco del estado
   */
  const refresh = useCallback(() => {
    checkStatus();
  }, [checkStatus]);

  /**
   * Inicia el hotspot
   */
  const startHotspot = useCallback(async (): Promise<boolean> => {
    if (loading) return false;
    
    // Verificar si ya está activo
    const currentStatus = fetchNativeStatus();
    if (currentStatus === 'RUNNING') {
      updateState('RUNNING');
      return true;
    }
    
    setLoading(true);
    setError(null);
    updateState('STARTING');

    try {
      // Llamar a la API nativa para iniciar
      nativeAPI.hotspot.start();
      
      // Esperar un momento y verificar
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Verificar resultado
      const newStatus = fetchNativeStatus();
      updateState(newStatus);
      setLoading(false);
      
      if (newStatus === 'RUNNING') {
        return true;
      } else {
        setError('No se pudo iniciar el hotspot. Verifica los permisos.');
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al iniciar hotspot';
      setError(errorMsg);
      updateState(fetchNativeStatus());
      setLoading(false);
      return false;
    }
  }, [loading, fetchNativeStatus, updateState]);

  /**
   * Detiene el hotspot
   */
  const stopHotspot = useCallback(async (): Promise<boolean> => {
    if (loading) return false;
    
    // Verificar si ya está detenido
    const currentStatus = fetchNativeStatus();
    if (currentStatus === 'STOPPED') {
      updateState('STOPPED');
      return true;
    }
    
    setLoading(true);
    setError(null);
    updateState('STOPPING');

    try {
      // Llamar a la API nativa para detener
      nativeAPI.hotspot.stop();
      
      // Esperar un momento y verificar
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Verificar resultado
      const newStatus = fetchNativeStatus();
      updateState(newStatus);
      setLoading(false);
      
      if (newStatus === 'STOPPED') {
        return true;
      } else {
        setError('No se pudo detener el hotspot.');
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al detener hotspot';
      setError(errorMsg);
      updateState(fetchNativeStatus());
      setLoading(false);
      return false;
    }
  }, [loading, fetchNativeStatus, updateState]);

  /**
   * Alterna el estado del hotspot
   */
  const toggleHotspot = useCallback(async (): Promise<boolean> => {
    const currentStatus = fetchNativeStatus();
    
    if (currentStatus === 'RUNNING') {
      return stopHotspot();
    } else {
      return startHotspot();
    }
  }, [fetchNativeStatus, startHotspot, stopHotspot]);

  // Polling del estado
  useEffect(() => {
    mountedRef.current = true;
    
    // Verificar estado inicial inmediatamente
    const initialStatus = fetchNativeStatus();
    updateState(initialStatus);
    console.log('[useHotspot] Estado inicial:', initialStatus);

    // Configurar polling para mantener el estado sincronizado
    pollingRef.current = window.setInterval(() => {
      if (!mountedRef.current || loading) return;
      
      const currentStatus = fetchNativeStatus();
      // Solo actualizar si el estado cambió y no estamos en medio de una operación
      if (currentStatus === 'RUNNING' || currentStatus === 'STOPPED') {
        updateState(currentStatus);
      }
    }, pollingInterval);

    return () => {
      mountedRef.current = false;
      
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      
      if (operationTimeoutRef.current) {
        clearTimeout(operationTimeoutRef.current);
        operationTimeoutRef.current = null;
      }
    };
  }, [pollingInterval]); // Removemos dependencias que causan re-renders

  // Derivar isEnabled del estado
  const isEnabled = state === 'RUNNING';

  return {
    state,
    isEnabled,
    loading,
    error,
    lastStateChange,
    startHotspot,
    stopHotspot,
    toggleHotspot,
    checkStatus,
    refresh
  };
}
