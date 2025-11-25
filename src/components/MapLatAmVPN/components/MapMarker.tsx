import React, { useEffect, useRef } from 'react';
import { Marker } from 'react-simple-maps';
import type { ConnectionState } from '../../../utils/connectionStates';

interface MapMarkerProps {
  coordinates: [number, number];
  vpnState: ConnectionState;
  className?: string;
  isTransitioning?: boolean;
}

export type { MapMarkerProps };

// Configuración de colores por estado
const STATE_COLORS = {
  connected: { primary: "#4cd99f", secondary: "rgba(76, 217, 159, 0.3)" },
  connecting: { primary: "#f59e0b", secondary: "rgba(245, 158, 11, 0.3)" },
  disconnected: { primary: "#ff6868", secondary: "rgba(255, 104, 104, 0.3)" }
} as const;

// Configuración de animaciones por estado
const PULSE_ANIMATIONS = {
  connected: 'animate-proton-connected',
  connecting: 'animate-proton-connecting',
  disconnected: 'animate-proton-disconnected'
} as const;

export const MapMarker: React.FC<MapMarkerProps> = ({
  coordinates,
  vpnState,
  className = "",
  isTransitioning = false
}) => {
  const markerRef = useRef<SVGGElement>(null);

  const isConnected = vpnState === "CONNECTED";
  const isConnecting = vpnState === "CONNECTING";
  
  const currentColors = isConnected ? STATE_COLORS.connected : 
                       isConnecting ? STATE_COLORS.connecting : 
                       STATE_COLORS.disconnected;
  
  const markerStateClass = isConnected ? 'marker-connected' : 
                          isConnecting ? 'marker-connecting' : 
                          'marker-disconnected';

  const pulseClass = isConnected ? PULSE_ANIMATIONS.connected :
                    isConnecting ? PULSE_ANIMATIONS.connecting :
                    PULSE_ANIMATIONS.disconnected;
  
  const shouldAnimate = true;

  useEffect(() => {
    const markerElement = markerRef.current;
    if (!markerElement) return;
    // Optimizaciones de will-change ya aplicadas en CSS base
  }, [vpnState, shouldAnimate]);
  const gradientId = `protonGradient-${vpnState}`;
  const dropShadowStyle = { filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.3))' };

  return (
    <Marker coordinates={coordinates}>
      <g ref={markerRef} className={`map-marker-group ${markerStateClass} ${className}`}>
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={currentColors.primary} stopOpacity="0.1" />
            <stop offset="40%" stopColor={currentColors.primary} stopOpacity="0.3" />
            <stop offset="80%" stopColor={currentColors.primary} stopOpacity="0.7" />
            <stop offset="100%" stopColor={currentColors.primary} stopOpacity="0.9" />
          </radialGradient>
        </defs>
        
        {shouldAnimate && (
          <circle
            r={30}
            fill={`url(#${gradientId})`}
            className={pulseClass}
          />
        )}
        
        <circle r={15} fill="rgba(255, 255, 255, 0.95)" style={dropShadowStyle} />
        <circle r={9} fill={currentColors.primary} />
        
        {isConnecting && !isTransitioning && (
          <circle
            r={21}
            fill="none"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth={1}
            strokeDasharray="2,2"
          />
        )}
      </g>
    </Marker>
  );
};
