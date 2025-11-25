import { useEffect, useState } from "react";
import { Wifi, WifiOff, Share2, Shield, ChevronDown, Settings } from "lucide-react";
import { Spinner } from "../ui/Spinner";
import { Modal } from "./Modal";
import { useHotspot } from "../../hooks/useHotspot";
import { useTranslations } from "../../context/LanguageContext";
import { Button, Text } from "../ui";

interface HotspotProps {
  onClose: () => void;
}


export function Hotspot({ onClose }: HotspotProps) {
  const t = useTranslations();
  const { isEnabled, loading, toggleHotspot, checkStatus } = useHotspot();
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // Nueva guía simplificada con proxy
  const proxyGuide = t.hotspot?.proxyGuide;

  return (
    <Modal onClose={onClose} title={t.hotspot.title} icon={Share2}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="text-center px-6 pt-6 pb-4">
          <div 
            className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center transition-all duration-300 border-2 ${isEnabled ? 'bg-success/10 border-success' : 'bg-surface-border/30 border-surface-border/70'}`}
          >
            {isEnabled ? <Wifi size={32} className="text-success" /> : <WifiOff size={32} className="text-neutral-text" />}
          </div>
          <div className="space-y-2">
            <Text 
              variant="h2" 
              color={isEnabled ? "accent" : "primary"}
              className="font-semibold block"
            >
              {isEnabled ? (t.hotspot?.sharing || "Compartiendo Conexión VPN") : (t.hotspot?.notSharing || "Hotspot Desactivado")}
            </Text>
            <Text variant="body" color="tertiary" className="text-sm max-w-sm mx-auto block">
              {isEnabled 
                ? (t.hotspot?.sharingDescription || "Otros dispositivos pueden conectarse y usar tu VPN")
                : (t.hotspot?.notSharingDescription || "Activa el hotspot para compartir tu conexión VPN segura")
              }
            </Text>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 space-y-4">
          {/* Control Principal */}
          <div className="text-center">
            <Button
              variant={isEnabled ? 'danger' : 'success'}
              size="large"
              onClick={toggleHotspot}
              disabled={loading}
              className="min-w-48"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" color="light" inline />
                  {t.hotspot?.processing || "Procesando..."}
                </div>
              ) : (
                isEnabled ? (t.hotspot?.stop || "Detener Hotspot") : (t.hotspot?.start || "Iniciar Hotspot")
              )}
            </Button>
          </div>

          {/* Estado Activo */}
          {isEnabled && (
            <div className="hotspot-active">
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