/**
 * FreeServersInfoModal
 * UI modal showing categorized free vs premium servers.
 * All visible strings come from translation keys under t.freeServersInfoModal.*
 */

import React, { useState, useEffect, useCallback } from 'react';
import { X, Info, Star, Crown, Wifi } from 'lucide-react';
import { nativeAPI } from '../../utils/unifiedNativeAPI';
import { useSafeArea } from '../../utils/deviceUtils';
import { useTranslations } from '../../context/LanguageContext';
import type { ConfigCategory, ConfigItem } from '../../types/config';
import { useAndroidBackButton } from '../../hooks/useAndroidBackButton';
import {
  BOTTOM_SHEET_CLOSE_MS,
  BOTTOM_SHEET_MAX_HEIGHT_VH,
  BOTTOM_SHEET_MIN_HEIGHT_VH,
  detectProtocol,
  FREE_SERVER_KEYWORDS,
  PREMIUM_SERVER_KEYWORDS,
  runAfterAnimation,
  THEME_PURPLE,
  MODAL_Z_OVERLAY,
  MODAL_Z_CONTAINER,
} from './modalConstants';
import { openExternal } from '../screens/SettingsScreen/utils/openExternal';

interface FreeServersInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectServer?: (serverId: number) => void;
  onOpenPricingScreen?: () => void;
}

export const FreeServersInfoModal: React.FC<FreeServersInfoModalProps> = ({ 
  isOpen, 
  onClose,
  onSelectServer,
  onOpenPricingScreen
}) => {
  const t = useTranslations();
  const [isAnimating, setIsAnimating] = useState(false);
  const [freeServers, setFreeServers] = useState<ConfigItem[]>([]);
  const [premiumServers, setPremiumServers] = useState<ConfigItem[]>([]);
  const { navigationBarHeight } = useSafeArea();

  // Cargar servidores cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      loadServers();
    }
  }, [isOpen]);

  const loadServers = () => {
    try {
      const allConfigs = nativeAPI.config.getAll();
      const freeServersList: ConfigItem[] = [];
      const premiumServersList: ConfigItem[] = [];

      allConfigs.forEach((category: ConfigCategory) => {
        const lower = category.name.toLowerCase();
        if (FREE_SERVER_KEYWORDS.some(k => lower.includes(k))) {
          freeServersList.push(...category.items);
        } else if (PREMIUM_SERVER_KEYWORDS.some(k => lower.includes(k))) {
          premiumServersList.push(...category.items);
        }
      });

      setFreeServers(freeServersList);
      setPremiumServers(premiumServersList);
    } catch (error) {
      console.error(t.freeServersInfoModal.loadError, error);
    }
  };

  // Función para cerrar con animación
  const handleClose = useCallback(() => {
    setIsAnimating(false);
    runAfterAnimation(() => onClose(), BOTTOM_SHEET_CLOSE_MS);
  }, [onClose]);

  // Manejo del botón atrás de Android: cerrar este modal primero
  useAndroidBackButton({
    isActive: isOpen,
    onBackPressed: handleClose,
    priority: 100,
    intercept: () => true, // consume siempre cuando está activo
  });

  // Función para seleccionar servidor
  const handleSelectServer = (serverId: number) => {
    onSelectServer?.(serverId);
    handleClose();
  };

  // Función para obtener el tipo de protocolo
  // Alias local para compatibilidad previa
  const themeColors = THEME_PURPLE;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay con fade */}
      <div 
        className={`bottom-sheet-overlay ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
        style={{ zIndex: MODAL_Z_OVERLAY, pointerEvents: 'auto' }}
        onClick={handleClose}
      />
      
      {/* Panel principal con transición desde abajo - Solo mitad de pantalla */}
      <div 
        className={`bottom-sheet ${isAnimating ? 'translate-y-0' : 'translate-y-full'} bg-neutral-900`}
        style={{ maxHeight: `${BOTTOM_SHEET_MAX_HEIGHT_VH}vh`, minHeight: `${BOTTOM_SHEET_MIN_HEIGHT_VH}vh`, zIndex: MODAL_Z_CONTAINER, pointerEvents: 'auto' }}
      >
        {/* Header */}
  <div className="bottom-sheet-header">
          {/* Indicador de arrastre */}
          <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-4"></div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={handleClose}
              aria-label={t.freeServersInfoModal.closeButton}
              title={t.freeServersInfoModal.closeButton}
              className="icon-btn-sm bg-transparent hover:bg-surface-border/50"
            >
              <X className="w-4 h-4 text-neutral-text" />
            </button>
            
            <div className="flex items-center space-x-2">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: themeColors.primary }}
              />
              <h1 className="text-sm font-semibold text-white tracking-tight">
                {t.freeServersInfoModal.title}
              </h1>
            </div>
            
            <div className="w-8" />
          </div>
        </div>

        {/* Content */}
  <div className="flex-1 overflow-y-auto hide-scrollbar">
          {/* Información header compacta */}
          <div className="p-4 bg-neutral-900/95 border-b border-neutral-800">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Info className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-white font-medium text-sm mb-1">
                  {t.freeServersInfoModal.availableConnections}
                </h2>
                <p className="text-neutral-text text-xs">
                  {t.freeServersInfoModal.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          <div className="px-4 py-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="stat-mini bg-neutral-800 border-neutral-700 shadow-[0_2px_4px_-1px_rgba(0,0,0,0.35),0_4px_10px_-2px_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-center mb-1">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-white font-medium text-sm">{freeServers.length}</span>
                </div>
                <p className="stat-mini-sub">{t.freeServersInfoModal.stats.freeServers}</p>
              </div>
              <div className="stat-mini bg-neutral-800 border-neutral-700 shadow-[0_2px_4px_-1px_rgba(0,0,0,0.35),0_4px_10px_-2px_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-center mb-1">
                  <Crown className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-white font-medium text-sm">{premiumServers.length}</span>
                </div>
                <p className="stat-mini-sub">{t.freeServersInfoModal.stats.premiumServers}</p>
              </div>
            </div>
          </div>

          {/* Compact list of free servers (translated labels only) */}
          {freeServers.length > 0 && (
            <div className="px-4 pb-3">
              <h3 className="text-white font-medium text-sm mb-3 flex items-center">
                <Wifi className="w-4 h-4 text-success mr-2" />
                {t.freeServersInfoModal.selectFreeServer}
              </h3>
              
              <div className="server-list">
                {freeServers.slice(0, 6).map((server) => {
                  const protocol = detectProtocol(server.mode);
                  return (
                    <button
                      key={server.id}
                      onClick={() => handleSelectServer(server.id)}
                      className="server-item bg-neutral-800 hover:bg-neutral-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-success flex-shrink-0"></div>
                            <span className="text-white font-medium text-sm truncate">
                              {server.name}
                            </span>
                            <div className={`protocol-tag ${protocol.bg} ${protocol.color} flex-shrink-0`}>
                              {protocol.name}
                            </div>
                          </div>
                          <p className="text-neutral-text text-xs truncate">
                            {server.description || t.freeServersInfoModal.serverDescription}
                          </p>
                        </div>
                        
                        <div className="ml-2 flex-shrink-0">
                          <div className="w-6 h-6 rounded bg-success/20 flex items-center justify-center">
                            <Wifi className="w-3 h-3 text-success" />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {freeServers.length > 6 && (
                <p className="text-neutral-muted text-xs text-center mt-2">
                  {t.freeServersInfoModal.moreServersAvailable.replace('{count}', (freeServers.length - 6).toString())}
                </p>
              )}
            </div>
          )}

          {/* Mensaje para premium */}
          {premiumServers.length > 0 && (
            <div className="px-4 pb-4">
              <div className="rounded-lg p-3 border border-brand/30 bg-neutral-800 shadow-[0_6px_18px_-4px_rgba(0,0,0,0.45),0_2px_6px_-2px_rgba(0,0,0,0.35)] backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <Crown className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm mb-1">
                      {t.freeServersInfoModal.upgradeTitle}
                    </h4>
                    <p className="text-neutral-text text-xs">
                      {t.freeServersInfoModal.upgradeMessage.replace('{count}', premiumServers.length.toString())}
                    </p>
                  </div>
                  <button 
                    className="upgrade-button flex-shrink-0 bg-brand/90 hover:bg-brand"
                    aria-label={t.freeServersInfoModal.upgradeButton}
                    onClick={() => {
                      handleClose();
                      if (onOpenPricingScreen) {
                        onOpenPricingScreen();
                      } else {
                        openExternal("https://web.jhservices.com.ar/planes");
                      }
                    }}
                  >
                    {t.freeServersInfoModal.upgradeButton}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Barra inferior con el mismo color que la barra de navegación */}
        <div 
          className="border-t border-surface-border/40 bg-surface/70"
          style={{ height: `${navigationBarHeight}px` }}
        >
          <div className="h-full flex items-center justify-center">
            <div className="w-12 h-1 rounded-full bg-brand/60" />
          </div>
        </div>
      </div>
    </>
  );
};
