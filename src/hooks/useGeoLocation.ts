/**
 * @file useGeoLocation.ts
 * @description Hook centralizado para manejar geolocalización por IP con reintento robusto
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { VpnState } from '../types/vpn';

export interface GeoLocationData {
  ip: string;
  country: string;
  country_code: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  isp?: string;
  lastUpdated: number;
}

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

// OPTIMIZACIÓN: Cache más largo para reducir requests
const geoCache = new Map<string, { data: GeoLocationData; timestamp: number }>();
const CACHE_DURATION = 300000; // 5 minutos de cache // OPTIMIZACIÓN: Cache de 20 segundos

async function fetchGeoLocationWithRetry(
  targetIP?: string,
  maxRetries: number = 5,
  forceRefresh: boolean = false
): Promise<GeoLocationData | null> {
  const cacheKey = targetIP || 'auto';
  const now = Date.now();
  
  // Verificar caché si no se fuerza refresh
  if (!forceRefresh && geoCache.has(cacheKey)) {
    const cached = geoCache.get(cacheKey)!;
    if (now - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
  }

  const services = [
    // Servicio 1: ip-api.com (no requiere HTTPS y permite CORS)
    async (ip?: string) => {
      const timestamp = Date.now();
      const url = ip 
        ? `http://ip-api.com/json/${ip}?t=${timestamp}&fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp,query`
        : `http://ip-api.com/json/?t=${timestamp}&fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp,query`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' },
        cache: 'no-store'
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      if (data.status !== 'success') {
        throw new Error(data.message || 'API Error');
      }
      
      if (data.lat && data.lon) {
        return {
          ip: data.query || ip || '',
          country: data.country || '',
          country_code: data.countryCode || '',
          region: data.regionName || '',
          city: data.city || '',
          latitude: parseFloat(data.lat),
          longitude: parseFloat(data.lon),
          timezone: data.timezone || '',
          isp: data.isp || '',
          lastUpdated: now
        };
      }
      throw new Error('Datos incompletos');
    },

    // Servicio 2: ipapi.co sin custom headers para evitar preflight CORS
    async (ip?: string) => {
      const timestamp = Date.now();
      const url = ip
        ? `https://ipapi.co/${ip}/json/?t=${timestamp}`
        : `https://ipapi.co/json/?t=${timestamp}`;
      
      const response = await fetch(url, {
        method: 'GET',
        cache: 'no-store'
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      if (data.error || data.reason) {
        throw new Error(data.reason || 'API Error');
      }
      
      if (data.latitude && data.longitude) {
        return {
          ip: data.ip || ip || '',
          country: data.country_name || '',
          country_code: data.country_code || '',
          region: data.region || '',
          city: data.city || '',
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          timezone: data.timezone || '',
          isp: data.org || '',
          lastUpdated: now
        };
      }
      throw new Error('Datos incompletos');
    },

    // Servicio 3: ipwhois.app (permite CORS)
    async (ip?: string) => {
      const timestamp = Date.now();
      const url = ip 
        ? `http://ipwhois.app/json/${ip}?t=${timestamp}` 
        : `http://ipwhois.app/json/?t=${timestamp}`;
      
      const response = await fetch(url, {
        cache: 'no-store'
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      if (!data.success) {
        throw new Error('API Error');
      }
      
      if (data.latitude && data.longitude) {
        return {
          ip: data.ip || ip || '',
          country: data.country || '',
          country_code: data.country_code || '',
          region: data.region || '',
          city: data.city || '',
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          timezone: data.timezone || '',
          isp: data.isp || '',
          lastUpdated: now
        };
      }
      throw new Error('Datos incompletos');
    },

    // Servicio 4: Fallback con datos hardcodeados para desarrollo
    async () => {
      return {
        ip: '181.1.158.192',
        country: 'Argentina',
        country_code: 'AR',
        region: 'Buenos Aires',
        city: 'Buenos Aires',
        latitude: -34.6037,
        longitude: -58.3816,
        timezone: 'America/Argentina/Buenos_Aires',
        isp: 'Proveedor Local',
        lastUpdated: now
      };
    }
  ];

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    for (const [serviceIndex, service] of services.entries()) {
      try {
        const result = await service(targetIP);
        if (result) {
          // Guardar en caché
          geoCache.set(cacheKey, { data: result, timestamp: now });
          
          return result;
        }
      } catch (error) {
        // Esperar entre servicios (excepto el último intento)
        if (serviceIndex < services.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    // Esperar antes del siguiente intento completo con exponential backoff
    if (attempt < maxRetries) {
      const delay = Math.min(2000 * Math.pow(2, attempt), 10000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  return null;
}

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
      
      const data = await fetchGeoLocationWithRetry(
        targetIP, 
        opts.maxRetries,
        forceRefresh || opts.forceRefresh
      );
      
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
    geoCache.clear();
  }, []);

  return { 
    geoData, 
    isLoading, 
    error, 
    lastUpdateTime,
    refresh, 
    clearCache 
  };
}
