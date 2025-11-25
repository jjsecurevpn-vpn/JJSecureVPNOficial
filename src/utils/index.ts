/**
 * @file index.ts
 * @description Barrel file para utils - Simplifica las importaciones
 * Prioriza las APIs nativas unificadas sobre las funciones legacy
 */

// ===== APIS NATIVAS UNIFICADAS (RECOMENDADO) =====
export { 
  nativeAPI as default,
  nativeAPI,
  vpnAPI,
  networkAPI,
  hotspotAPI,
  deviceAPI,
  configAPI,
  authAPI,
  airplaneAPI,
  uiAPI,
  logsAPI,
  i18nAPI,
  systemAPI,
  eventsAPI
} from './unifiedNativeAPI';

// ===== SISTEMA DE EVENTOS UNIFICADO (RECOMENDADO) =====
export {
  eventsSystem,
  initializeEvents,
  onDtunnelEvent,
  offDtunnelEvent,
  emitDtunnelEvent,
  registerEventListeners,
  useVpnStateEvent,
  useConfigSelectedEvent,
  useUserCheckResultEvent,
  useNetworkStatsEvent,
  type DtunnelEventPayloads,
  type DtunnelEventName
} from './unifiedEventsSystem';

// ===== HOOKS DE EVENTOS (RECOMENDADO) =====
export { useUnifiedVpn } from '../hooks/useUnifiedVpn';
export { useHotspotEvents, useHotspotActive } from '../hooks/useHotspotEvents';
export { useUserEvents, useConfigEvents } from '../hooks/useUserEvents';

// ===== UTILIDADES OPTIMIZADAS =====
export {
  formatBytes,
  formatDuration,
  formatSpeed,
  formatTime,
  formatPercentage
} from './formatUtils';

export {
  type ConnectionState,
  type ConnectionStateConfig,
  CONNECTION_STATES,
  getCurrentConnectionState,
  getStateConfig
} from './connectionStates';

export {
  updateBrowserColors,
  applyBrowserTheme,
  type BrowserColorConfig
} from './metaUtils';

export {
  getStatusBarHeight,
  getNavigationBarHeight,
  setNavigationBarColor,
  getSystemBarsHeight,
  getAvailableHeight,
  getModalMaxHeight,
  getModalHeightStyle,
  useSafeArea,
  getDeviceInfo
} from './deviceUtils';

export {
  normalizeColor,
  getProtocol,
  getStatusInfo,
  filterByQuery,
  filterCategoriesWithItems
} from './serverUtils';

export {
  getStorageItem,
  setStorageItem,
  getRecentConnections,
  saveRecentConnection,
  clearRecentConnections,
  getRecentConnectionsByType,
  isRecentConnection,
  hasCompletedWelcome,
  getUserOnboardingStatus,
  resetWelcomeScreen,
  type RecentConnection
} from './storageUtils';

// ===== UTILIDADES MENORES =====
// (Eliminado) Re-exports de performanceUtils removidos tras archivado: debounce, throttle, isNativeFunctionAvailable, batchProcessor
// TODO: Si se reintroduce alguno, evaluar mover a un hook local o util específico.

// ===== FUNCIONES LEGACY (DEPRECADAS) =====
// Estas funciones se mantienen para compatibilidad pero están deprecadas
// Se recomienda usar nativeAPI en su lugar

// (Eliminado) hotspotUtils.ts archivado (getHotspotStatus, startHotspot, stopHotspot, HotspotDebugInfo)
// TODO: Limpiar referencias legacy externas si aún existen imports directos (grep 'getHotspotStatus').

/**
 * @deprecated Usar unifiedEventsSystem en su lugar
 */
export {
  onDtunnelEvent as legacyOnDtunnelEvent,
  emitDtunnelEvent as legacyEmitDtunnelEvent,
  type DtunnelEventMap,
  type DtunnelEvent
} from './dtEvents';

/**
 * @deprecated Usar nativeAPI directamente en su lugar
 */
export {
  // VPN
  getConnectionState,
  startConnection,
  stopConnection,
  
  // Red
  getDescargaBytes,
  getSubidaBytes,
  
  // (Funciones de IP legacy eliminadas: getVpnIP, getCurrentDisplayIP, getIPLabel)
  getNetworkType,
  checkNetworkConnectivity,
  getNetworkStatus,
  
  // Configuración
  getActiveConfig,
  shouldShowInput,
  
  // Sistema
  checkBatteryOptimization,
  openApnSettings,
  openNetworkSettings,
  checkForUpdates,
  
  // Android Back Button
  setAndroidBackButtonListener,
  removeAndroidBackButtonListener
} from './appFunctions';

/**
 * @deprecated Sistema innecesario
 */
export {
  validateLicense,
  getLicenseInfo,
  isComponentLicensed,
  LICENSE_CONFIG
} from './licensing';

