/**
 * @file VPNStatusOverlay.tsx
 * @description Overlay que muestra el estado de conexión VPN con sistema responsivo
 */

import React from 'react';
import { ConnectedLockIcon, DisconnectedLockIcon } from './VPNLockIcons';
import { 
  HEADER_UI_STYLES, 
  getResponsiveOverlayStyles
} from '../../utils/headerUtils';
import { useResponsive } from '../../hooks/useResponsive';

interface VPNStatusOverlayProps {
  isConnected: boolean;
  statusText: string;
  iconColor: string;
  ariaLabel: string;
  country?: string;
  ipAddress?: string; // Hacemos la IP opcional
}

export const VPNStatusOverlay: React.FC<VPNStatusOverlayProps> = ({
  isConnected,
  statusText,
  iconColor,
  ariaLabel,
  country,
  ipAddress
}) => {
  const { breakpoint } = useResponsive();
  const overlayStyles = getResponsiveOverlayStyles(breakpoint);
  // Tipografía responsiva ligera sin helper legacy
  const statusSizeMap: Record<string, string> = {
    xs: 'text-btn',
    sm: 'text-btn',
    md: 'text-btn',
    lg: 'text-btn',
    xl: 'text-btn'
  };
  const captionSizeMap: Record<string, string> = {
    xs: 'text-caption',
    sm: 'text-caption',
    md: 'text-caption',
    lg: 'text-caption',
    xl: 'text-caption'
  };

  return (
    <div 
      className={HEADER_UI_STYLES.overlay}
      style={overlayStyles}
      data-tutorial="location-display"
    >
      {isConnected ? (
        <ConnectedLockIcon aria-label={ariaLabel} className={iconColor} />
      ) : (
        <DisconnectedLockIcon aria-label={ariaLabel} className={iconColor} />
      )}

  <div className={`${statusSizeMap[breakpoint]} font-semibold tracking-wide text-white/90`}>
        {statusText}
      </div>

      {/* Solo mostrar IP si se proporciona */}
      {ipAddress && (
        <div className={HEADER_UI_STYLES.ipContainer}>
          <span className={HEADER_UI_STYLES.ipBadge}>
            {country && (
              <>
  <span className={`${captionSizeMap[breakpoint]} font-semibold text-white/95`}>{country}</span>
                <span className={HEADER_UI_STYLES.separator}>•</span>
              </>
            )}
  <span className={`${captionSizeMap[breakpoint]} font-mono tracking-[0.5px] text-white/90`}>{ipAddress}</span>
          </span>
        </div>
      )}
    </div>
  );
};

export type { VPNStatusOverlayProps };
