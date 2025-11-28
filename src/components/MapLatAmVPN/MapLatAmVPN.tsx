import { useMemo, useState, useEffect, useRef } from 'react';
import type { ConnectionState } from '../../utils/connectionStates';
import '../../styles/animations-map.css';

import { useGeoLocation } from '../../hooks/useGeoLocation';
import { useNativeLocation } from './hooks/useNativeLocation.ts';
import { MapBackground } from './components/MapBackground.tsx';
import { MapCanvas } from './components/MapCanvas.tsx';
import {
  getSmartCoords,
  MAP_TRANSITION_MS,
  MAP_FALLBACK_DELAY,
  MAP_FALLBACK_COORDS
} from './utils/mapUtils.ts';
import { getCurrentCountryInfo } from './utils/geoMappingUtils.ts';

export interface MapLatAmVPNProps {
  current?: [number, number];
  showGrid?: boolean;
  className?: string;
  vpnState?: ConnectionState;
}

export default function MapLatAmVPN({
  current,
  showGrid = false,
  className = "",
  vpnState = "DISCONNECTED",
}: MapLatAmVPNProps) {
  const [showFallback, setShowFallback] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevStateRef = useRef<ConnectionState>(vpnState);
  const transitionRef = useRef<NodeJS.Timeout | null>(null);

  const { geoData } = useGeoLocation(vpnState, undefined, {
    autoRefresh: true,
    refreshInterval: vpnState === "CONNECTED" ? 45000 : 30000,
    maxRetries: 2
  });
  
  useNativeLocation({ vpnState, refreshInterval: 60000 });

  // Maneja transiciones visuales al cambiar estado de conexión
  useEffect(() => {
    const prevState = prevStateRef.current;
    const isStateTransition = 
      (prevState === 'DISCONNECTED' && vpnState === 'CONNECTED') ||
      (prevState === 'CONNECTED' && vpnState === 'DISCONNECTED');

    if (prevState !== vpnState) {
      if (isStateTransition) {
        setIsTransitioning(true);
        if (transitionRef.current) clearTimeout(transitionRef.current);
        
        transitionRef.current = setTimeout(() => {
          setIsTransitioning(false);
          transitionRef.current = null;
        }, MAP_TRANSITION_MS);
      }
      prevStateRef.current = vpnState;
    }

    return () => {
      if (transitionRef.current) {
        clearTimeout(transitionRef.current);
        transitionRef.current = null;
      }
    };
  }, [vpnState]);

  // Muestra fallback si no se obtienen coordenadas a tiempo
  useEffect(() => {
    const hasValidCoords = geoData?.latitude && geoData?.longitude;
    
    if (hasValidCoords) {
      setShowFallback(false);
      return;
    }

    const timeoutId = setTimeout(() => setShowFallback(true), MAP_FALLBACK_DELAY);
    return () => clearTimeout(timeoutId);
  }, [geoData?.latitude, geoData?.longitude]);

  // Calcula coordenadas finales con fallback a cache o ubicación por defecto
  const finalCoords: [number, number] = useMemo(() => {
    const smartCoords = getSmartCoords(current, geoData);
    
    if (smartCoords) {
      try {
        sessionStorage.setItem('lastValidCoords', JSON.stringify(smartCoords));
      } catch (error) {
        console.warn('No se pudo guardar coordenadas en cache:', error);
      }
      return smartCoords;
    }

    // Intenta recuperar de cache
    try {
      const cached = sessionStorage.getItem('lastValidCoords');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length === 2) {
          return parsed as [number, number];
        }
      }
    } catch (error) {
      console.warn('Error al leer cache de coordenadas:', error);
    }

    return MAP_FALLBACK_COORDS;
  }, [current, geoData?.latitude, geoData?.longitude]);

  // Obtiene información del país actual con cache opcional
  const currentCountry = useMemo(() => {
    const info = getCurrentCountryInfo(geoData?.country_code, geoData?.country);
    
    if (info.code2) {
      try {
        sessionStorage.setItem('lastValidCountry', JSON.stringify({ 
          code: info.code2, 
          name: geoData?.country 
        }));
      } catch (error) {
        console.warn('No se pudo guardar país en cache:', error);
      }
    }
    
    return info;
  }, [geoData?.country_code, geoData?.country]);

  const shouldShowMap = (geoData?.latitude && geoData?.longitude) || showFallback;
  const transitionClass = isTransitioning ? 'map-transitioning' : 'map-stable';
  const renderOverlay = (label: string) => (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/85 z-10">
      <div className="text-center">
        <div className="mb-2 inline-flex">
          <span className="spinner-sm border-blue-500 border-t-transparent" />
        </div>
        <div className="text-white/60 text-xs">{label}</div>
      </div>
    </div>
  );

  return (
    <MapBackground showGrid={showGrid} className={`${className} ${transitionClass}`}>
      {/* Indicador de carga */}
      {!shouldShowMap && renderOverlay('Ubicando...')}

      {shouldShowMap && (
        <MapCanvas 
          coordinates={finalCoords}
          currentCountry={currentCountry}
          vpnState={vpnState}
          isTransitioning={isTransitioning}
        />
      )}
    </MapBackground>
  );
}
