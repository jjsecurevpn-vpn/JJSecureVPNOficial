import { useEffect, useState, useCallback } from "react";
import { Wifi, WifiOff, Share2, Shield, ChevronDown, Settings, AlertTriangle, RefreshCw, Power, PowerOff } from "lucide-react";
import { Spinner } from "../ui/Spinner";
import { Modal } from "./Modal";
import { useHotspot, HotspotState } from "../../hooks/useHotspot";
import { useTranslations } from "../../context/LanguageContext";
import { Button, Text } from "../ui";

interface HotspotProps {
  onClose: () => void;
}

// Mapa de colores y estilos según el estado
const stateConfig: Record<HotspotState, { 
  bgClass: string; 
  borderClass: string; 
  iconColor: string;
  pulseClass?: string;
}> = {
  RUNNING: { 
    bgClass: 'bg-success/15', 
    borderClass: 'border-success', 
    iconColor: 'text-success',
    pulseClass: 'animate-pulse'
  },
  STOPPED: { 
    bgClass: 'bg-surface-border/30', 
    borderClass: 'border-surface-border/70', 
    iconColor: 'text-neutral-text'
  },
  STARTING: { 
    bgClass: 'bg-brand/15', 
    borderClass: 'border-brand', 
    iconColor: 'text-brand',
    pulseClass: 'animate-pulse'
  },
  STOPPING: { 
    bgClass: 'bg-warning/15', 
    borderClass: 'border-warning', 
    iconColor: 'text-warning',
    pulseClass: 'animate-pulse'
  },
  UNKNOWN: { 
    bgClass: 'bg-neutral/10', 
    borderClass: 'border-neutral/50', 
    iconColor: 'text-neutral-text'
  }
};

export function Hotspot({ onClose }: HotspotProps) {
  const t = useTranslations();
  const { 
    state, 
    isEnabled, 
    loading, 
    error, 
    toggleHotspot, 
    refresh,
    lastStateChange 
  } = useHotspot(1000); // Polling cada 1 segundo
  
  const [showInstructions, setShowInstructions] = useState(false);
  const [showError, setShowError] = useState(false);

  // Mostrar error cuando ocurra
  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Obtener configuración visual según estado
  const currentConfig = stateConfig[state] || stateConfig.UNKNOWN;

  // Texto de estado para mostrar
  const getStateText = useCallback(() => {
    switch (state) {
      case 'RUNNING':
        return t.hotspot?.sharing || "Compartiendo Conexión VPN";
      case 'STOPPED':
        return t.hotspot?.notSharing || "Hotspot Desactivado";
      case 'STARTING':
        return t.hotspot?.starting || "Iniciando Hotspot...";
      case 'STOPPING':
        return t.hotspot?.stopping || "Deteniendo Hotspot...";
      default:
        return t.hotspot?.checkingStatus || "Verificando estado...";
    }
  }, [state, t.hotspot]);

  // Descripción del estado
  const getStateDescription = useCallback(() => {
    switch (state) {
      case 'RUNNING':
        return t.hotspot?.sharingDescription || "Otros dispositivos pueden conectarse y usar tu VPN";
      case 'STOPPED':
        return t.hotspot?.notSharingDescription || "Activa el hotspot para compartir tu conexión VPN segura";
      case 'STARTING':
        return t.hotspot?.startingDescription || "Preparando el hotspot, espera un momento...";
      case 'STOPPING':
        return t.hotspot?.stoppingDescription || "Finalizando conexiones activas...";
      default:
        return t.hotspot?.unknownDescription || "Verificando el estado del servicio de hotspot...";
    }
  }, [state, t.hotspot]);

  // Icono según estado
  const StateIcon = state === 'RUNNING' ? Wifi : WifiOff;

  // Handler para el toggle
  const handleToggle = async () => {
    await toggleHotspot();
  };

  // Nueva guía simplificada con proxy
  const proxyGuide = t.hotspot?.proxyGuide;

  return (
    <Modal onClose={onClose} title={t.hotspot.title} icon={Share2}>
      <div className="flex flex-col h-full">
        {/* Header con estado visual */}
        <div className="text-center px-6 pt-6 pb-4">
          {/* Indicador de estado grande */}
          <div 
            className={`relative w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center transition-all duration-500 border-2 ${currentConfig.bgClass} ${currentConfig.borderClass} ${currentConfig.pulseClass || ''}`}
          >
            <StateIcon size={36} className={`${currentConfig.iconColor} transition-colors duration-300`} />
            
            {/* Indicador de estado pequeño */}
            <div 
              className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-background flex items-center justify-center ${
                isEnabled ? 'bg-success' : state === 'STARTING' || state === 'STOPPING' ? 'bg-brand' : 'bg-neutral'
              }`}
            >
              {loading ? (
                <RefreshCw size={12} className="text-white animate-spin" />
              ) : isEnabled ? (
                <Power size={12} className="text-white" />
              ) : (
                <PowerOff size={12} className="text-white" />
              )}
            </div>
          </div>

          {/* Texto de estado */}
          <div className="space-y-2">
            <Text 
              variant="h2" 
              color={isEnabled ? "accent" : state === 'STARTING' ? "primary" : "primary"}
              className="font-semibold block"
            >
              {getStateText()}
            </Text>
            <Text variant="body" color="tertiary" className="text-sm max-w-sm mx-auto block">
              {getStateDescription()}
            </Text>
            
            {/* Mostrar última actualización */}
            {lastStateChange && (
              <Text variant="bodySmall" color="tertiary" className="text-xs opacity-60">
                {t.hotspot?.lastUpdate || "Última actualización"}: {lastStateChange.toLocaleTimeString()}
              </Text>
            )}
          </div>
        </div>

        {/* Mensaje de error */}
        {showError && error && (
          <div className="mx-6 mb-4 p-3 rounded-lg bg-danger/10 border border-danger/30 flex items-center gap-3">
            <AlertTriangle size={20} className="text-danger flex-shrink-0" />
            <Text variant="body" color="primary" className="text-sm">
              {error}
            </Text>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 space-y-4">
          {/* Control Principal */}
          <div className="text-center space-y-3">
            <Button
              variant={isEnabled ? 'danger' : 'success'}
              size="large"
              onClick={handleToggle}
              disabled={loading || state === 'STARTING' || state === 'STOPPING'}
              className="min-w-52 transition-all duration-300"
            >
              {loading || state === 'STARTING' || state === 'STOPPING' ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" color="light" inline />
                  <span>
                    {state === 'STARTING' 
                      ? (t.hotspot?.starting || "Iniciando...") 
                      : state === 'STOPPING' 
                        ? (t.hotspot?.stopping || "Deteniendo...")
                        : (t.hotspot?.processing || "Procesando...")
                    }
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isEnabled ? <PowerOff size={18} /> : <Power size={18} />}
                  <span>
                    {isEnabled 
                      ? (t.hotspot?.stop || "Detener Hotspot") 
                      : (t.hotspot?.start || "Iniciar Hotspot")
                    }
                  </span>
                </div>
              )}
            </Button>

            {/* Botón de refrescar */}
            <button
              onClick={refresh}
              disabled={loading}
              className="text-sm text-brand hover:text-brand/80 flex items-center gap-1 mx-auto transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              {t.hotspot?.refreshStatus || "Actualizar estado"}
            </button>
          </div>

          {/* Estado Activo - Información adicional */}
          {isEnabled && (
            <div className="hotspot-active bg-success/10 border border-success/30 rounded-lg p-4 flex items-start gap-3">
              <Shield size={20} className="text-success mt-0.5 flex-shrink-0" />
              <div>
                <Text variant="bodyLarge" color="accent" className="font-semibold block mb-1">
                  {t.hotspot?.activeConnectionTitle || "✅ Conexión VPN Compartida Activa"}
                </Text>
                <Text variant="body" color="tertiary" className="text-sm">
                  {t.hotspot?.activeConnectionDescription || "Los dispositivos conectados a tu hotspot están protegidos por la VPN"}
                </Text>
              </div>
            </div>
          )}

          {/* Instrucciones Mejoradas */}
          <div>
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              aria-expanded={showInstructions}
              aria-controls="hotspot-instructions"
              className="w-full p-4 rounded-lg border border-surface-border bg-surface/70 hover:bg-surface-border/50 transition-all flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-brand/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-brand/20 text-brand">
                  <Settings size={16} />
                </div>
                <Text variant="bodyLarge" color="primary" className="font-semibold">
                  {t.hotspot?.howToConfigure || "📋 Guía Paso a Paso"}
                </Text>
              </div>
              <ChevronDown 
                size={20} 
                className={`transition-transform duration-200 ${showInstructions ? 'rotate-180' : ''} text-neutral-text`}
              />
            </button>

            {showInstructions && (
              <div id="hotspot-instructions" className="mt-4 space-y-4">
                <div className="p-4 rounded-lg border-l-4 bg-brand/10 border-brand/40">
                  <Text variant="bodyLarge" color="primary" className="font-semibold block mb-2">
                    {t.hotspot?.whatYouWillAchieve || "🎯 ¿Qué conseguirás?"}
                  </Text>
                  <Text variant="body" color="tertiary" className="text-sm">
                    {t.hotspot?.whatYouWillAchieveDesc || "Convertir tu dispositivo en un punto de acceso WiFi que comparte tu conexión VPN segura con otros dispositivos (móviles, tablets, laptops, etc.)"}
                  </Text>
                </div>

                {proxyGuide && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border bg-surface/50 border-surface-border/60">
                      <Text variant="bodyLarge" color="primary" className="font-semibold block mb-2">
                        {proxyGuide.title}
                      </Text>
                      <div className="space-y-4">
                        {proxyGuide.steps.map((s, idx) => (
                          <div key={idx} className="p-3 rounded-md bg-surface-border/30 text-sm whitespace-pre-line leading-relaxed border border-surface-border/40">
                            {s}
                          </div>
                        ))}
                        <div className="p-3 rounded-md bg-success/10 border border-success/30 text-sm font-medium">
                          {proxyGuide.finalMessage}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

        <div className="p-4 rounded-lg border bg-brand/10 border-brand/30">
                  <Text variant="bodyLarge" color="primary" className="font-semibold block mb-2">
                    {t.hotspot?.importantTips?.title || "💡 Consejos Importantes"}
                  </Text>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
          <span className="text-brand">•</span>
                      <Text variant="body" color="tertiary">
                        {t.hotspot?.importantTips?.battery || "Batería: El hotspot consume más batería, mantén tu dispositivo cargado"}
                      </Text>
                    </div>
                    <div className="flex items-start gap-2">
          <span className="text-brand">•</span>
                      <Text variant="body" color="tertiary">
                        {t.hotspot?.importantTips?.speed || "Velocidad: La velocidad se compartirá entre todos los dispositivos conectados"}
                      </Text>
                    </div>
                    <div className="flex items-start gap-2">
          <span className="text-brand">•</span>
                      <Text variant="body" color="tertiary">
                        {t.hotspot?.importantTips?.security || "Seguridad: Todos los dispositivos conectados estarán protegidos por tu VPN automáticamente"}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer rápido */}
  <div className="p-6 border-t border-surface-border flex-shrink-0">
          <div className="text-center">
            <Text variant="bodySmall" color="tertiary" className="text-xs">
              {t.hotspot?.footerTip || "💡 Tip: Asegúrate de estar conectado a la VPN antes de iniciar el hotspot"}
            </Text>
          </div>
        </div>
      </div>
    </Modal>
  );
}