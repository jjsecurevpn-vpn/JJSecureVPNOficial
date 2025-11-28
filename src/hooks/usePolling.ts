/**
 * @file usePolling.ts
 * @description Hook reutilizable para polling con control de ciclo de vida
 */

import { useEffect, useRef, useCallback } from 'react';

export interface UsePollingOptions {
  /** Intervalo de polling en ms */
  intervalMs: number;
  /** Si el polling está habilitado (default: true) */
  enabled?: boolean;
  /** Ejecutar inmediatamente al montar (default: true) */
  immediate?: boolean;
  /** Callback cuando hay error */
  onError?: (error: unknown) => void;
}

/**
 * Hook genérico para ejecutar polling con cleanup automático
 * 
 * @example
 * ```tsx
 * usePolling(() => {
 *   const data = fetchData();
 *   setState(data);
 * }, { intervalMs: 5000, enabled: isActive });
 * ```
 */
export function usePolling(
  callback: () => void | Promise<void>,
  options: UsePollingOptions
): { 
  /** Forzar ejecución inmediata */
  trigger: () => void;
  /** Si el polling está activo */
  isPolling: boolean;
} {
  const { 
    intervalMs, 
    enabled = true, 
    immediate = true,
    onError 
  } = options;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);
  const isPollingRef = useRef(false);

  // Mantener callback actualizado sin recrear el intervalo
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const executeCallback = useCallback(async () => {
    try {
      await callbackRef.current();
    } catch (error) {
      onError?.(error);
    }
  }, [onError]);

  const trigger = useCallback(() => {
    executeCallback();
  }, [executeCallback]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isPollingRef.current = false;
      return;
    }

    isPollingRef.current = true;

    // Ejecutar inmediatamente si se requiere
    if (immediate) {
      executeCallback();
    }

    // Configurar intervalo
    intervalRef.current = setInterval(executeCallback, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isPollingRef.current = false;
    };
  }, [enabled, intervalMs, immediate, executeCallback]);

  return {
    trigger,
    isPolling: isPollingRef.current,
  };
}

/**
 * Hook de polling con frecuencia adaptativa
 * Cambia la frecuencia basado en una condición
 */
export function useAdaptivePolling(
  callback: () => void | Promise<void>,
  options: {
    /** Intervalo cuando está activo (ej: conectado) */
    activeIntervalMs: number;
    /** Intervalo cuando está inactivo */
    inactiveIntervalMs: number;
    /** Condición para usar el intervalo activo */
    isActive: boolean;
    /** Si el polling está habilitado */
    enabled?: boolean;
    /** Ejecutar inmediatamente */
    immediate?: boolean;
  }
) {
  const { 
    activeIntervalMs, 
    inactiveIntervalMs, 
    isActive, 
    enabled = true,
    immediate = true 
  } = options;

  const intervalMs = isActive ? activeIntervalMs : inactiveIntervalMs;

  return usePolling(callback, { 
    intervalMs, 
    enabled, 
    immediate 
  });
}
