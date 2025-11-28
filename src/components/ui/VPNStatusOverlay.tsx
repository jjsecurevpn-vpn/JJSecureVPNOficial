/**
 * @file VPNStatusOverlay.tsx
 * @description Contenedor visual elegante para mostrar estado de conexión VPN
 * Diseño inspirado en cards modernas con glassmorphism
 */

import React from 'react';
import { ConnectedLockIcon, DisconnectedLockIcon } from './VPNLockIcons';

interface VPNStatusOverlayProps {
  isConnected: boolean;
  statusText: string;
  iconColor: string;
  ariaLabel: string;
  country?: string;
  ipAddress?: string;
}

export const VPNStatusOverlay: React.FC<VPNStatusOverlayProps> = ({
  isConnected,
  statusText,
  ariaLabel,
  country,
  ipAddress
}) => {
  // Solo mostrar el contenedor elegante cuando está conectado
  if (!isConnected) {
    return (
      <div 
        className="flex flex-col items-center gap-2 py-4"
        data-tutorial="location-display"
      >
        <DisconnectedLockIcon aria-label={ariaLabel} className="text-red-400" />
        <div className="text-sm font-semibold tracking-wide text-white/80">
          {statusText}
        </div>
      </div>
    );
  }

  // Contenedor elegante cuando está conectado (similar a NetShield)
  return (
    <div 
      className="w-full mx-auto mt-12"
      style={{ paddingLeft: 12, paddingRight: 12 }}
      data-tutorial="location-display"
    >
      <div 
        className="relative overflow-hidden rounded-2xl backdrop-blur-md border border-white/10"
        style={{
          background: 'linear-gradient(135deg, rgba(40, 45, 55, 0.85) 0%, rgba(30, 35, 45, 0.9) 100%)'
        }}
      >
        {/* Efecto de brillo sutil en el borde superior */}
        <div 
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(76, 217, 159, 0.3) 50%, transparent 100%)'
          }}
        />
        
        <div className="flex items-center gap-4 p-4">
          {/* Icono del candado con glow */}
          <div 
            className="relative flex-shrink-0"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(76, 217, 159, 0.4))'
            }}
          >
            <ConnectedLockIcon aria-label={ariaLabel} className="text-emerald-400 w-10 h-10" />
          </div>
          
          {/* Contenido de texto */}
          <div className="flex-1 min-w-0">
            <div className="text-base font-semibold text-white tracking-wide">
              {statusText}
            </div>
            
            {/* País e IP */}
            {(country || ipAddress) && (
              <div className="flex items-center gap-2 mt-1 text-sm text-white/70">
                {country && (
                  <span className="font-medium text-white/90">{country}</span>
                )}
                {country && ipAddress && (
                  <span className="text-white/40">•</span>
                )}
                {ipAddress && (
                  <span className="font-mono text-xs tracking-wide text-emerald-300/80">
                    {ipAddress}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export type { VPNStatusOverlayProps };
