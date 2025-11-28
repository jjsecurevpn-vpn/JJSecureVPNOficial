/**
 * @file useGeoLocation.ts
 * @description Hook centralizado para manejar geolocalización por IP con reintento robusto
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { VpnState } from '../types/vpn';
import { clearGeoLocationCache, fetchGeoLocationWithRetry, type GeoLocationData } from '../utils/geoLocationService';

interface UseGeoLocationOptions {
  /** Actualizar automáticamente cuando cambie el estado de VPN */
  autoRefresh?: boolean;
  /** Intervalo de actualización en milisegundos cuando VPN está conectado */
  refreshInterval?: number;
  /** Número máximo de reintentos */
  maxRetries?: number;
  /** Forzar actualización ignorando caché */
  forceRefresh?: boolean;
}

const DEFAULT_OPTIONS: UseGeoLocationOptions = {
  autoRefresh: true,
  refreshInterval: 120000, // 2 minutos // OPTIMIZACIÓN: Intervalo base más largo (30 segundos)
  maxRetries: 1, // OPTIMIZACIÓN: Menos reintentos
  forceRefresh: false,
};

export function useGeoLocation(
  vpnState: VpnState = 'DISCONNECTED',
  targetIP?: string,
  options: UseGeoLocationOptions = {}
) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  const [geoData, setGeoData] = useState<GeoLocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isUnmountedRef = useRef(false);

  const fetchLocation = useCallback(async (forceRefresh = false) => {
    if (isUnmountedRef.current) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await fetchGeoLocationWithRetry({
        targetIP,
        maxRetries: opts.maxRetries,
        forceRefresh: forceRefresh || opts.forceRefresh,
      });
      
      if (isUnmountedRef.current) return;
      
      if (data) {
        setGeoData(data);
        setLastUpdateTime(Date.now());
      } else {
        throw new Error('No se pudo obtener geolocalización');
      }
    } catch (err) {
      if (isUnmountedRef.current) return;
      
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMsg);
    } finally {
      if (!isUnmountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [targetIP, opts.maxRetries, opts.forceRefresh]);

  // Efecto para obtener ubicación inicial y manejar cambios
  useEffect(() => {
    isUnmountedRef.current = false;
    
    // Limpiar timeouts/intervalos previos
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Obtener ubicación inmediatamente
    fetchLocation(true); // Forzar refresh en primera carga

    // OPTIMIZACIÓN: Intervalos de actualización más largos para reducir carga
    if (opts.autoRefresh) {
      // Configurar actualización automática cuando VPN está conectado
      if (vpnState === 'CONNECTED') {
        // OPTIMIZACIÓN: Intervalo mucho más largo cuando está conectado
        const baseInterval = opts.refreshInterval || 30000;
        intervalRef.current = setInterval(() => {
          fetchLocation(false); // OPTIMIZACIÓN: No forzar refresh en intervalos automáticos
        }, Math.max(baseInterval * 2, 60000)); // Mínimo 60 segundos
      } else if (vpnState === 'DISCONNECTED') {
        // OPTIMIZACIÓN: Delay más largo después de desconectar
        timeoutRef.current = setTimeout(() => {
          fetchLocation(true);
        }, 12000); // Aumentado a 12 segundos
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [vpnState, targetIP, fetchLocation, opts.autoRefresh, opts.refreshInterval]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Función para refrescar manualmente
  const refresh = useCallback(() => {
    fetchLocation(true);
  }, [fetchLocation]);

  // Función para limpiar caché
  const clearCache = useCallback(() => {
    clearGeoLocationCache();
    fetchLocation(true);
  }, [fetchLocation]);

  return { 
    geoData, 
    isLoading, 
    error, 
    lastUpdateTime,
    refresh, 
    clearCache 
  };
}
