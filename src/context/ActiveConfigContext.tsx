import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { nativeAPI } from "../utils";
import type { ConfigItem } from "../types/config";

interface ActiveConfigContextProps {
  activeConfig: ConfigItem | null;
  setActiveConfigId: (id: number) => void;
  refreshActiveConfig: () => void;
}

const ActiveConfigContext = createContext<ActiveConfigContextProps | undefined>(
  undefined
);

export const ActiveConfigProvider = ({ children }: { children: ReactNode }) => {
  const [activeConfig, setActiveConfigState] = useState<ConfigItem | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastConfigKeyRef = useRef<string>('');

  // Función para generar clave única de configuración
  const getConfigKey = (config: ConfigItem | null): string => {
    return config ? `${config.id}:${config.name}` : 'none';
  };

  // Función optimizada para verificar cambios
  const checkForChanges = () => {
    try {
      const current = nativeAPI.config.getActive();
      const currentKey = getConfigKey(current);
      
      if (currentKey !== lastConfigKeyRef.current) {
        lastConfigKeyRef.current = currentKey;
        setActiveConfigState(current);
      }
    } catch {
      // Silencioso
    }
  };

  // Polling agresivo al montar
  useEffect(() => {
    // Check inicial
    checkForChanges();
    
    // Polling cada 500ms (menos agresivo)
    intervalRef.current = setInterval(checkForChanges, 500);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Event listeners básicos
  useEffect(() => {
    // Handler genérico sin payload (fuerza relectura nativa con pequeño delay)
    const softRefresh = () => {
      setTimeout(checkForChanges, 50);
      setTimeout(checkForChanges, 150);
    };

    // Handler que aprovecha payload directo del evento nativo si viene incluido
    const handleConfigSelected = (payload?: unknown) => {
      try {
        if (payload && typeof payload === 'object') {
          // Actualizar directamente con el objeto recibido (retiene campos auth completos)
            lastConfigKeyRef.current = getConfigKey(payload as ConfigItem);
            setActiveConfigState(payload as ConfigItem);
            // Hacer un refresco diferido por si el nativo también actualiza su almacenamiento interno
            setTimeout(checkForChanges, 120);
            return;
        }
      } catch {/* ignorar */}
      softRefresh();
    };

    if (typeof window !== 'undefined') {
      const w = window as unknown as Record<string, unknown>;
      w.DtNewDefaultConfigEvent = softRefresh;
      w.DtConfigSelectedEvent = handleConfigSelected;

      // También escuchar eventos de focus/visibilidad
      window.addEventListener('focus', softRefresh);
      const visHandler = () => { if (!document.hidden) softRefresh(); };
      document.addEventListener('visibilitychange', visHandler);
    }

    return () => {
      if (typeof window !== 'undefined') {
        const w = window as unknown as Record<string, unknown>;
        delete w.DtNewDefaultConfigEvent;
        delete w.DtConfigSelectedEvent;
        window.removeEventListener('focus', softRefresh);
        document.removeEventListener('visibilitychange', () => {});
      }
    };
  }, []);

  const refreshActiveConfig = () => {
    checkForChanges();
  };

  const setActiveConfigId = (id: number) => {
    nativeAPI.config.setActive(id);
    setTimeout(checkForChanges, 100);
    setTimeout(checkForChanges, 300);
  };

  return (
    <ActiveConfigContext.Provider
      value={{ activeConfig, setActiveConfigId, refreshActiveConfig }}
    >
      {children}
    </ActiveConfigContext.Provider>
  );
};

export function useActiveConfig() {
  const ctx = useContext(ActiveConfigContext);
  if (!ctx) {
    throw new Error("useActiveConfig debe ser usado dentro de ActiveConfigProvider");
  }
  return ctx;
}
