/**
 * @file appFunctions.ts - SIMPLIFICADO
 * @description Solo lógica específica de negocio - APIs nativas movidas a nativeAPI
 */

import type { ConfigItem } from "../types/config";
import { nativeAPI } from "./unifiedNativeAPI";

// (Eliminadas funciones legacy de IP: getVpnIP, getCurrentDisplayIP, getIPLabel)

// ===== LÓGICA DE RED COMPLEJA =====

/**
 * Detecta el tipo de red (WiFi, móvil, etc.)
 * MANTENER: Lógica compleja específica
 */
export function getNetworkType(): string {
  try {
    // Prioridad 1: API nativa unificada
    const networkInfo = nativeAPI.network.getNetworkInfo();
    if (networkInfo?.type_name) {
      return networkInfo.type_name === 'WIFI' ? 'WiFi' : 'Móvil';
    }

    // Fallback: Navigator API
    const nav = navigator as unknown as Record<string, unknown>;
    const connection = (nav.connection || nav.mozConnection || nav.webkitConnection) as { type?: string } | undefined;
    if (connection) {
      if (connection.type === 'wifi') return 'WiFi';
      if (connection.type === 'cellular') return 'Móvil';
      return connection.type || 'Desconocido';
    }
    
    return 'Desconocido';
  } catch {
    return 'Error';
  }
}

/**
 * Verifica conectividad de red
 * MANTENER: Lógica compleja con fallbacks
 */
export function checkNetworkConnectivity(): boolean {
  try {
    // Prioridad 1: API nativa usando getNetworkInfo
    const networkInfo = nativeAPI.network.getNetworkInfo();
    if (networkInfo && networkInfo.detailed_state) {
      return networkInfo.detailed_state.toLowerCase().includes('connected');
    }

    // Fallback: Navigator API
    return navigator.onLine;
  } catch {
    return false;
  }
}

/**
 * Obtiene estado detallado de la red
 * MANTENER: Combina múltiples fuentes de datos
 */
export function getNetworkStatus(): string {
  const isConnected = checkNetworkConnectivity();
  if (!isConnected) return "Sin conexión";
  
  const networkType = getNetworkType();
  const vpnState = nativeAPI.vpn.getState();
  
  if (vpnState === "CONNECTED") {
    return `${networkType} + VPN`;
  }
  
  return networkType;
}

// ===== UTILIDADES DE SISTEMA =====

/**
 * Verifica optimización de batería
 * MANTENER: Lógica específica de Android
 */
export function checkBatteryOptimization(): boolean {
  try {
    const w = window as unknown as Record<string, unknown>;
    const dtIgnore = w.DtIgnoreBatteryOptimizations as { execute?: () => boolean } | undefined;
    if (dtIgnore?.execute && typeof dtIgnore.execute === "function") {
      return dtIgnore.execute();
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Abre configuración APN
 * MANTENER: Funcionalidad específica no disponible en nativeAPI
 */
export function openApnSettings(): void {
  try {
    if (typeof window !== 'undefined') {
      const w = window as unknown as Record<string, unknown>;
      const dtOpenApn = w.DtOpenApnSettings as { execute?: () => void } | undefined;
      dtOpenApn?.execute?.();
    }
  } catch (error) {
    console.warn('Error abriendo configuración APN:', error);
  }
}

/**
 * Abre configuración de red
 * MANTENER: Funcionalidad específica no disponible en nativeAPI
 */
export function openNetworkSettings(): void {
  try {
    if (typeof window !== 'undefined') {
      const w = window as unknown as Record<string, unknown>;
      const dtOpenNet = w.DtOpenNetworkSettings as { execute?: () => void } | undefined;
      dtOpenNet?.execute?.();
    }
  } catch (error) {
    console.warn('Error abriendo configuración de red:', error);
  }
}

/**
 * Verifica actualizaciones
 * MANTENER: Lógica específica de actualización
 */
export function checkForUpdates(): void {
  try {
    if (typeof window !== 'undefined') {
      const w = window as unknown as Record<string, unknown>;
      const dtCheck = w.DtCheckForUpdates as { execute?: () => void } | undefined;
      dtCheck?.execute?.();
    }
  } catch (error) {
    console.warn('Error verificando actualizaciones:', error);
  }
}

// ===== MANEJO DE BOTÓN BACK DE ANDROID =====

/**
 * Configura listener para botón back de Android
 * MANTENER: Lógica compleja específica de Android
 */
export function setAndroidBackButtonListener(callback: () => void): boolean {
  try {
    if (typeof window === 'undefined') return false;

    const w = window as unknown as Record<string, unknown>;

    // Configurar listener nativo
    if (w.DtSetBackButtonListener) {
      (w.DtSetBackButtonListener as { execute?: () => void }).execute?.();
    }

    // Configurar callback
    w.onAndroidBackPressed = () => {
      try {
        callback();
        return true;
      } catch (error) {
        console.error('Error en callback de botón back:', error);
        return false;
      }
    };

    // Configurar listener para eventos de hardware
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.keyCode === 27) {
        event.preventDefault();
        callback();
      }
    };

    // Configurar listener para eventos de navegación
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      callback();
    };

    // Agregar listeners
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);

    // Guardar referencias para cleanup
    w._backButtonHandlers = {
      keydown: handleKeyDown,
      popstate: handlePopState
    };

    return true;
  } catch (error) {
    console.error('Error configurando listener de botón back:', error);
    return false;
  }
}

/**
 * Remueve listener del botón back de Android
 * MANTENER: Cleanup complejo específico de Android
 */
export function removeAndroidBackButtonListener(): boolean {
  try {
    if (typeof window === 'undefined') return false;

    const w = window as unknown as Record<string, unknown>;

    // Remover callback nativo
    w.onAndroidBackPressed = null;

    // Remover listener nativo
    if (w.DtRemoveBackButtonListener) {
      (w.DtRemoveBackButtonListener as { execute?: () => void }).execute?.();
    }

    // Remover listeners DOM
    const handlers = w._backButtonHandlers as Record<string, EventListener> | undefined;
    if (handlers) {
      if (handlers.keydown) {
        document.removeEventListener('keydown', handlers.keydown);
      }
      if (handlers.popstate) {
        window.removeEventListener('popstate', handlers.popstate);
      }
      delete w._backButtonHandlers;
    }

    return true;
  } catch (error) {
    console.error('Error removiendo listener de botón back:', error);
    return false;
  }
}

// ===== FUNCIONES DEPRECADAS - REDIRIGEN A nativeAPI =====

/**
 * @deprecated Usar nativeAPI.auth.shouldShowInput() en su lugar
 */
export function shouldShowInput(type: "username" | "password" | "uuid"): boolean {
  console.warn('⚠️ DEPRECADO: shouldShowInput() - Usar nativeAPI.auth.shouldShowInput()');
  return nativeAPI.auth.shouldShowInput(type);
}

/**
 * @deprecated Usar nativeAPI.config.getActive() en su lugar
 */
export function getActiveConfig(): ConfigItem | null {
  console.warn('⚠️ DEPRECADO: getActiveConfig() - Usar nativeAPI.config.getActive()');
  return nativeAPI.config.getActive();
}

/**
 * @deprecated Usar nativeAPI.vpn.getState() en su lugar
 */
export function getConnectionState(): string | null {
  console.warn('⚠️ DEPRECADO: getConnectionState() - Usar nativeAPI.vpn.getState()');
  return nativeAPI.vpn.getState();
}

/**
 * @deprecated Usar nativeAPI.vpn.start() en su lugar
 */
export function startConnection(): void {
  console.warn('⚠️ DEPRECADO: startConnection() - Usar nativeAPI.vpn.start()');
  nativeAPI.vpn.start();
}

/**
 * @deprecated Usar nativeAPI.vpn.stop() en su lugar
 */
export function stopConnection(): void {
  console.warn('⚠️ DEPRECADO: stopConnection() - Usar nativeAPI.vpn.stop()');
  nativeAPI.vpn.stop();
}

/**
 * @deprecated Usar nativeAPI.network.getDownloadBytes() en su lugar
 */
export function getDescargaBytes(): number {
  console.warn('⚠️ DEPRECADO: getDescargaBytes() - Usar nativeAPI.network.getDownloadBytes()');
  return nativeAPI.network.getDownloadBytes();
}

/**
 * @deprecated Usar nativeAPI.network.getUploadBytes() en su lugar
 */
export function getSubidaBytes(): number {
  console.warn('⚠️ DEPRECADO: getSubidaBytes() - Usar nativeAPI.network.getUploadBytes()');
  return nativeAPI.network.getUploadBytes();
}

/**
 * Limpia datos de la aplicación
 * MANTENER: Funcionalidad específica de sistema
 */
export function cleanAppData(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    
    const w = window as unknown as Record<string, unknown>;
    const dtClean = w.DtCleanApp as { execute?: () => boolean } | undefined;
    if (dtClean?.execute) {
      return dtClean.execute();
    }
    return false;
  } catch (error) {
    console.warn('Error limpiando datos de la app:', error);
    return false;
  }
}
