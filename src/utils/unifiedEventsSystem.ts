/**
 * @file unifiedEventsSystem.ts
 * @description Sistema unificado de eventos que reemplaza dtEvents.ts y partes de nativeConnectionRecovery.ts
 */

// ===== TIPOS DE EVENTOS =====
export interface DtunnelEventPayloads {
  // Eventos de usuario
  DtCheckUserStartedEvent: undefined;
  DtCheckUserResultEvent: {
    expiration_days: string;
    limit_connections: string;
    expiration_date: string;
    username: string;
    count_connections: string;
  };
  
  // Eventos de configuración
  DtNewDefaultConfigEvent: undefined;
  DtConfigSelectedEvent: {
    id: number;
    name: string;
    description: string;
    mode: string;
    [key: string]: any;
  };
  
  // Eventos de VPN
  DtVpnStartedSuccessEvent: undefined;
  DtVpnStoppedSuccessEvent: undefined;
  DtVpnStateEvent: 'STOPPING' | 'CONNECTING' | 'CONNECTED' | 'AUTH' | 'AUTH_FAILED' | 'DISCONNECTED';
  
  // Eventos de sistema
  DtMessageErrorEvent: undefined;
  DtNewLogEvent: undefined;
  DtErrorToastEvent: string;
  DtSuccessToastEvent: string;
  
  // Eventos de red
  DtNetworkStatsEvent: {
    downloadBytes: number;
    uploadBytes: number;
    downloadSpeed: string;
    uploadSpeed: string;
  };
  DtLocalIPEvent: { ip: string };
  
  // Eventos de hotspot
  DtHotspotStateEvent: { state: 'RUNNING' | 'STOPPED' };
  
  // Eventos de modo avión
  DtAirplaneModeEvent: { enabled: boolean };
}

export type DtunnelEventName = keyof DtunnelEventPayloads;

// ===== SISTEMA DE EVENTOS UNIFICADO =====
class UnifiedEventsSystem {
  private listeners: Map<string, Set<Function>> = new Map();
  private nativeListeners: Map<string, Function> = new Map();
  private isInitialized = false;

  /**
   * Inicializa el sistema de eventos
   */
  init(): void {
    if (this.isInitialized) return;
    
    this.setupNativeEventCapture();
    this.isInitialized = true;
  }

  /**
   * Configura la captura de eventos nativos
   */
  private setupNativeEventCapture(): void {
    // Lista de todos los eventos nativos posibles
    const nativeEvents: DtunnelEventName[] = [
      'DtCheckUserStartedEvent',
      'DtCheckUserResultEvent',
      'DtNewDefaultConfigEvent',
      'DtConfigSelectedEvent',
      'DtVpnStartedSuccessEvent',
      'DtVpnStoppedSuccessEvent',
      'DtVpnStateEvent',
      'DtMessageErrorEvent',
      'DtNewLogEvent',
      'DtErrorToastEvent',
      'DtSuccessToastEvent',
      'DtNetworkStatsEvent',
      'DtLocalIPEvent',
      'DtHotspotStateEvent',
      'DtAirplaneModeEvent'
    ];

    // Configurar interceptores para cada evento nativo
    nativeEvents.forEach(eventName => {
      const nativeHandler = (payload: any) => {
        console.log(`📡 Evento nativo recibido: ${eventName}`, payload);
        this.emit(eventName, payload);
      };

      // Registrar el handler en window para que DTunnel lo llame
      (window as any)[eventName] = nativeHandler;
      this.nativeListeners.set(eventName, nativeHandler);
    });
  }

  /**
   * Registra un listener para un evento específico
   */
  on<T extends DtunnelEventName>(
    eventName: T,
    callback: (payload: DtunnelEventPayloads[T]) => void
  ): () => void {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    
    this.listeners.get(eventName)!.add(callback);
    
    // Retorna función para remover el listener
    return () => {
      this.off(eventName, callback);
    };
  }

  /**
   * Remueve un listener específico
   */
  off<T extends DtunnelEventName>(
    eventName: T,
    callback: (payload: DtunnelEventPayloads[T]) => void
  ): void {
    const eventListeners = this.listeners.get(eventName);
    if (eventListeners) {
      eventListeners.delete(callback);
      
      // Si no quedan listeners, remover el set
      if (eventListeners.size === 0) {
        this.listeners.delete(eventName);
      }
    }
  }

  /**
   * Emite un evento a todos los listeners registrados
   */
  emit<T extends DtunnelEventName>(
    eventName: T,
    payload: DtunnelEventPayloads[T]
  ): void {
    const eventListeners = this.listeners.get(eventName);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(payload);
        } catch (error) {
          console.error(`Error en listener de ${eventName}:`, error);
        }
      });
    }
  }

  /**
   * Registra múltiples listeners de una vez
   */
  register<T extends DtunnelEventName>(
    listeners: Partial<{
      [K in T]: (payload: DtunnelEventPayloads[K]) => void;
    }>
  ): () => void {
    const unsubscribers: Array<() => void> = [];
    
    Object.entries(listeners).forEach(([eventName, callback]) => {
      const unsubscribe = this.on(eventName as T, callback as any);
      unsubscribers.push(unsubscribe);
    });
    
    // Retorna función para remover todos los listeners registrados
    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }

  /**
   * Remueve todos los listeners para un evento
   */
  removeAllListeners(eventName?: DtunnelEventName): void {
    if (eventName) {
      this.listeners.delete(eventName);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Obtiene estadísticas del sistema de eventos
   */
  getStats(): {
    totalEvents: number;
    totalListeners: number;
    eventStats: Record<string, number>;
  } {
    let totalListeners = 0;
    const eventStats: Record<string, number> = {};
    
    this.listeners.forEach((listeners, eventName) => {
      const count = listeners.size;
      totalListeners += count;
      eventStats[eventName] = count;
    });
    
    return {
      totalEvents: this.listeners.size,
      totalListeners,
      eventStats
    };
  }

  /**
   * Limpia todos los recursos del sistema de eventos
   */
  cleanup(): void {
    console.log('🧹 Limpiando sistema unificado de eventos');
    
    // Remover todos los listeners
    this.listeners.clear();
    
    // Remover listeners nativos
    this.nativeListeners.forEach((_, eventName) => {
      delete (window as any)[eventName];
    });
    this.nativeListeners.clear();
    
    this.isInitialized = false;
  }

  /**
   * Verifica si el sistema está inicializado
   */
  get initialized(): boolean {
    return this.isInitialized;
  }
}

// ===== INSTANCIA SINGLETON =====
export const eventsSystem = new UnifiedEventsSystem();

// ===== FUNCIONES DE CONVENIENCIA =====

/**
 * Inicializa el sistema de eventos (llamar una vez al inicio de la app)
 */
export const initializeEvents = (): void => {
  eventsSystem.init();
};

/**
 * Registra un listener para un evento específico
 */
export const onDtunnelEvent = <T extends DtunnelEventName>(
  eventName: T,
  callback: (payload: DtunnelEventPayloads[T]) => void
): (() => void) => {
  return eventsSystem.on(eventName, callback);
};

/**
 * Remueve un listener específico
 */
export const offDtunnelEvent = <T extends DtunnelEventName>(
  eventName: T,
  callback: (payload: DtunnelEventPayloads[T]) => void
): void => {
  eventsSystem.off(eventName, callback);
};

/**
 * Emite un evento manualmente (útil para testing)
 */
export const emitDtunnelEvent = <T extends DtunnelEventName>(
  eventName: T,
  payload: DtunnelEventPayloads[T]
): void => {
  eventsSystem.emit(eventName, payload);
};

/**
 * Registra múltiples listeners de una vez
 */
export const registerEventListeners = <T extends DtunnelEventName>(
  listeners: Partial<{
    [K in T]: (payload: DtunnelEventPayloads[K]) => void;
  }>
): (() => void) => {
  return eventsSystem.register(listeners);
};

// ===== HOOKS PARA EVENTOS COMUNES =====

/**
 * Hook para manejar cambios de estado de VPN
 */
export const useVpnStateEvent = (
  callback: (state: DtunnelEventPayloads['DtVpnStateEvent']) => void
): (() => void) => {
  return onDtunnelEvent('DtVpnStateEvent', callback);
};

/**
 * Hook para manejar selección de configuración
 */
export const useConfigSelectedEvent = (
  callback: (config: DtunnelEventPayloads['DtConfigSelectedEvent']) => void
): (() => void) => {
  return onDtunnelEvent('DtConfigSelectedEvent', callback);
};

/**
 * Hook para manejar resultado de verificación de usuario
 */
export const useUserCheckResultEvent = (
  callback: (result: DtunnelEventPayloads['DtCheckUserResultEvent']) => void
): (() => void) => {
  return onDtunnelEvent('DtCheckUserResultEvent', callback);
};

/**
 * Hook para manejar estadísticas de red
 */
export const useNetworkStatsEvent = (
  callback: (stats: DtunnelEventPayloads['DtNetworkStatsEvent']) => void
): (() => void) => {
  return onDtunnelEvent('DtNetworkStatsEvent', callback);
};

export default eventsSystem;
