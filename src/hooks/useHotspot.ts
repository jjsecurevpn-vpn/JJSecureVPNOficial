import { useState, useCallback } from "react";
import { nativeAPI } from "../utils";
import { useHotspotEvents } from "./useHotspotEvents";

export function useHotspot() {
  // Usar el hook de eventos para obtener el estado actual
  const hotspotEvents = useHotspotEvents();
  
  // Estado local solo para operaciones
  const [loading, setLoading] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);

  const isEnabled = hotspotEvents.isActive;

  const toggleHotspot = useCallback(async () => {
    setLoading(true);
    setOperationError(null);

    try {
      if (isEnabled) {
        nativeAPI.hotspot.stop();
      } else {
        nativeAPI.hotspot.start();
      }

      // El estado se actualizará automáticamente por eventos
      // Timeout de seguridad para el loading
      setTimeout(() => {
        setLoading(false);
      }, 3000);
      
    } catch (error) {
      setLoading(false);
      setOperationError(error instanceof Error ? error.message : "Error en hotspot");
    }
  }, [isEnabled]);

  // Verificar cambio de estado para parar loading
  const checkStatus = useCallback(() => {
    const currentStatus = nativeAPI.hotspot.getStatus();
    return currentStatus;
  }, []);

  return {
    isEnabled,
    loading,
    toggleHotspot,
    checkStatus,
    error: operationError,
    state: hotspotEvents.state,
    lastStateChange: hotspotEvents.lastStateChange
  };
}
