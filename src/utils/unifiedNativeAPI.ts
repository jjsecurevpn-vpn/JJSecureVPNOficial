// API unificada para concentrar todas las funciones nativas expuestas por DTunnel.

import type { VpnState } from "../types/vpn";
import type { ConfigCategory, ConfigItem } from "../types/config";

// Tipado seguro para window
const w = typeof window !== 'undefined' ? (window as unknown as Record<string, unknown>) : {};

function dtCall<T = unknown, R = T>(name: keyof Window, fallback: R, transform?: (raw: T) => R): R {
  try {
    const fn = w[name as string] as { execute?: (...a: unknown[]) => T } | undefined;
    if (!fn?.execute) return fallback;
    const raw = fn.execute();
    return transform ? transform(raw) : (raw as unknown as R);
  } catch {
    return fallback;
  }
}

const dtExecVoid = (name: keyof Window, ...args: unknown[]) => {
  try {
    const fn = w[name as string];
    (fn as { execute?: (...a: unknown[]) => void })?.execute?.(...args);
  } catch { /* noop */ }
};

const dtGetNum = (name: keyof Window, fallback = 0): number => dtCall(name, fallback, (n: unknown) => Number(n) || fallback);
const dtGetStr = (name: keyof Window, fallback = ""): string => dtCall(name, fallback, (s: unknown) => (typeof s === "string" ? s : fallback));


// --- VPN ---
const _VALID_VPN_STATES: VpnState[] = ["CONNECTED","DISCONNECTED","CONNECTING","STOPPING","NO_NETWORK","AUTH","AUTH_FAILED"];
type VpnStateListener = (s: VpnState) => void;
const _vpnListeners = new Set<VpnStateListener>();
let _lastVpnState: VpnState | null = null;

// Registrar listener global nativo una sola vez (idempotente)
if (!(window as unknown as Record<string, unknown>).__vpnStateHookInstalled) {
  const w = window as unknown as Record<string, unknown>;
  w.__vpnStateHookInstalled = true;
  w.DtVpnStateEvent = (state: unknown) => {
    if (typeof state === 'string' && _VALID_VPN_STATES.includes(state as VpnState)) {
      _lastVpnState = state as VpnState;
      _vpnListeners.forEach(cb => {
        try { cb(state as VpnState); } catch (e) { console.warn('vpn listener error', e); }
      });
    }
  };
}

export const vpnAPI = {
  /** Obtiene el estado actual validado */
  getState(): VpnState | null {
    return dtCall('DtGetVpnState', null, (state: unknown) => {
      if (typeof state !== 'string') return null;
      return _VALID_VPN_STATES.includes(state as VpnState) ? state as VpnState : null;
    });
  },

  /** Último estado cacheado por eventos (si existe) */
  getCachedState(): VpnState | null { return _lastVpnState; },

  /** Inicia la VPN si no está ya conectando/conectada */
  start(): boolean {
    const st = this.getCachedState() || this.getState();
    if (st && ["CONNECTED","CONNECTING","AUTH"].includes(st)) return false; // idempotente
    dtCall('DtExecuteVpnStart', undefined);
    return true;
  },

  /** Detiene la VPN si no está ya deteniéndose/desconectada */
  stop(): boolean {
    const st = this.getCachedState() || this.getState();
    if (st && ["DISCONNECTED","STOPPING","NO_NETWORK"].includes(st)) return false;
    dtCall('DtExecuteVpnStop', undefined);
    return true;
  },

  disconnect(): boolean { return this.stop(); },

  async connect(opts: { timeoutMs?: number; targetState?: VpnState } = {}): Promise<VpnState | null> {
    const { timeoutMs = 15000, targetState = 'CONNECTED' } = opts;
    const started = this.start();
    if (!started) {
      const cur = this.getCachedState() || this.getState();
      if (cur === targetState) return cur;
    }
    return new Promise((resolve) => {
      const deadline = Date.now() + timeoutMs;
      const check = (s: VpnState) => {
        if (s === targetState) {
          this.offStateChange(check);
          resolve(s);
        } else if (Date.now() > deadline) {
          this.offStateChange(check);
          resolve(s);
        }
      };
      this.onStateChange(check);
      // safety poll
      const safety = setInterval(() => {
        const cur = this.getCachedState() || this.getState();
        if (cur) check(cur);
        if (Date.now() > deadline) clearInterval(safety);
      }, 750);
    });
  },

  /** Suscribe cambios de estado (wrapper sobre evento global) */
  onStateChange(cb: VpnStateListener): void { _vpnListeners.add(cb); },
  offStateChange(cb: VpnStateListener): void { _vpnListeners.delete(cb); }
};

// --- Estadísticas de red ---
export const networkAPI = {
  getDownloadBytes(): number { return dtCall('DtGetNetworkDownloadBytes', 0, (n: unknown) => Number(n) || 0); },
  getUploadBytes(): number { return dtCall('DtGetNetworkUploadBytes', 0, (n: unknown) => Number(n) || 0); },
  resetSession(): void {
    // Mantener paridad con la API nativa aunque la app no lo use directamente.
  },
  getLocalIP(): string { return dtCall('DtGetLocalIP', '127.0.0.1', (s: unknown)=> (typeof s === 'string' && s) ? s : '127.0.0.1'); },
  getPing(): number { return dtCall('DtGetPingResult', 0, (n: unknown)=> Number(n) || 0); },
  getNetworkInfo(): { type_name:'MOBILE'|'WIFI'; type:number; extra_info:string; detailed_state:string; reason?:string } | null {
    return dtCall('DtGetNetworkData', null, (raw: unknown) => {
      if (raw && typeof raw === 'object' && 'type_name' in raw) {
        return raw as { type_name:'MOBILE'|'WIFI'; type:number; extra_info:string; detailed_state:string; reason?:string };
      }
      return null;
    });
  }
};

// --- Hotspot ---
export const hotspotAPI = {
  getStatus(): 'STOPPED' | 'RUNNING' | null {
    const s = dtGetStr('DtGetStatusHotSpotService', 'STOPPED');
    return s === 'RUNNING' ? 'RUNNING' : s === 'STOPPED' ? 'STOPPED' : null;
  },
  start(): void { dtExecVoid('DtStartHotSpotService'); },
  stop(): void { dtExecVoid('DtStopHotSpotService'); }
};

// --- Dispositivo ---
export const deviceAPI = {
  getStatusBarHeight(): number { return dtGetNum('DtGetStatusBarHeight'); },
  getNavigationBarHeight(): number { return dtGetNum('DtGetNavigationBarHeight'); },
  setNavigationBarColor(color: string): void { dtExecVoid('DtSetNavigationBarColor', color); },
  getDeviceID(): string { return dtGetStr('DtGetDeviceID'); },
  getAppVersion(): string { return dtGetStr('DtAppVersion'); }
};

// --- Configuraciones ---
export const configAPI = {
  getAll(): ConfigCategory[] {
    try {
      const configs = window.DtGetConfigs?.execute();
      if (!configs) throw new Error('No configs available');
      
      const parsed = JSON.parse(configs);
      if (!Array.isArray(parsed)) throw new Error('Invalid config format');
      
      // Ordenar categorías y elementos
      parsed.sort((a: Record<string, unknown>, b: Record<string, unknown>) => ((a.sorter as number) || 0) - ((b.sorter as number) || 0));
      parsed.forEach((category: Record<string, unknown>) => {
        if (Array.isArray(category.items) && category.items.length) {
          (category.items as Record<string, unknown>[]).sort((a: Record<string, unknown>, b: Record<string, unknown>) => ((a.sorter as number) || 0) - ((b.sorter as number) || 0));
        }
      });
      
      return parsed;
    } catch (error) {
      console.error('Error getting configs:', error);
      throw error;
    }
  },

  getActive(): ConfigItem | null {
    try {
      const raw = window.DtGetDefaultConfig?.execute();
      if (!raw) return null;
      let parsed: Record<string, unknown> | null = null;
      try { parsed = JSON.parse(raw); } catch { return null; }
      
      if (!parsed) return null;

      // Si falta 'auth' u otros campos, intentamos enriquecer desde el listado global.
      const needsEnrich = typeof parsed !== 'object' || !parsed.auth;
      if (needsEnrich) {
        try {
          const allRaw = window.DtGetConfigs?.execute();
          if (allRaw) {
            const all = JSON.parse(allRaw);
            if (Array.isArray(all)) {
              for (const cat of all) {
                if (cat?.items && Array.isArray(cat.items)) {
                  const found = cat.items.find((it: Record<string, unknown>) => it && (it.id as string) === (parsed as Record<string, unknown>).id);
                  if (found) {
                    // Fusionar sin sobrescribir campos ya presentes
                    parsed = { ...found, ...parsed, auth: (found.auth as unknown) || parsed.auth };
                    break;
                  }
                }
              }
            }
          }
        } catch (e) {
          console.debug('[configAPI] enrich fallback failed', e);
        }
      }
      return parsed as ConfigItem;
    } catch {
      return null;
    }
  },

  setActive(configId: number): boolean {
    try {
      window.DtSetConfig?.execute(configId);
      return true;
    } catch {
      return false;
    }
  }
};

// --- Autenticación ---
export const authAPI = {
  getUsername(): string { try { return window.DtUsername?.get() || ''; } catch { return ''; } },
  setUsername(username: string): void { try { window.DtUsername?.set(username); } catch {/* noop */} },
  getPassword(): string { try { return window.DtPassword?.get() || ''; } catch { return ''; } },
  setPassword(password: string): void { try { window.DtPassword?.set(password); } catch {/* noop */} },
  getUUID(): string { try { return window.DtUuid?.get() || ''; } catch { return ''; } },
  setUUID(uuid: string): void { try { window.DtUuid?.set(uuid); } catch {/* noop */} },
  checkUser(): void { dtExecVoid('DtStartCheckUser'); },

  /**
   * Determina qué campos de autenticación deben mostrarse para el servidor activo.
   * Oculta credenciales solo para servidores específicos como "SOLO EMERGENCIAS".
   * EXCEPCIÓN: Si el item/config tiene "Hysteria" en nombre o descripción, SÍ muestra credenciales.
   */
  shouldShowInput(type: "username" | "password" | "uuid"): boolean {
    try {
      const config = configAPI.getActive();
      if (!config) return true;

      const mode = config.mode?.toLowerCase() ?? '';
      const serverName = config.name?.toLowerCase() ?? '';
      const serverDescription = config.description?.toLowerCase() ?? '';

      // Detectar si es un servidor Hysteria UDP (por nombre, descripción o modo)
      const isHysteriaServer = 
        serverName.includes('hysteria') || 
        serverDescription.includes('hysteria') ||
        mode.includes('hysteria');

      // Si es Hysteria, SIEMPRE mostrar credenciales (usuario/password)
      if (isHysteriaServer) {
        console.log('🔍 [shouldShowInput] Hysteria detectado - mostrando credenciales', {
          type,
          serverName: config.name,
          mode
        });
        // Hysteria no usa UUID, solo user/pass
        if (type === "uuid") {
          return false;
        }
        return true;
      }

      // Servidores específicos que NO requieren credenciales
      // IMPORTANTE: Esta verificación se hace DESPUÉS de Hysteria, así que
      // "Hysteria Gratuito" SÍ mostrará credenciales (Hysteria tiene prioridad)
      const noCredentialsKeywords = [
        'solo emergencias',
        'emergency only',
        'gratuito',
        'free'
      ];

      // Verificar si es un servidor sin credenciales
      const isNoCredentialsServer = noCredentialsKeywords.some(keyword => 
        serverName.includes(keyword) || serverDescription.includes(keyword)
      );

      console.log('🔍 [shouldShowInput]', {
        type,
        serverName: config.name,
        isNoCredentialsServer,
        isHysteriaServer,
        mode
      });

      // Si es servidor sin credenciales, ocultar campos de usuario/contraseña
      if (isNoCredentialsServer) {
        if (mode.startsWith("v2ray")) {
          return type === "uuid"; // V2Ray aún podría necesitar UUID
        }
        return false; // No mostrar campos de credenciales
      }

      // Lógica normal para otros servidores
      if (mode.startsWith("v2ray")) {
        return type === "uuid";
      }

      if (type === "uuid") {
        return false;
      }

      return true;
    } catch {
      return true;
    }
  }
};

// --- Modo avión ---
export const airplaneAPI = {
  getState(): 'ACTIVE' | 'INACTIVE' | null {
    const s = dtGetStr('DtAirplaneState');
    return s === 'ACTIVE' || s === 'INACTIVE' ? s : null;
  },
  activate(): void { dtExecVoid('DtAirplaneActivate'); },
  deactivate(): void { dtExecVoid('DtAirplaneDeactivate'); }
};

// --- Interfaz nativa ---
export const uiAPI = {
  openConfigDialog(): void { dtExecVoid('DtExecuteDialogConfig'); },
  openLogDialog(): void { dtExecVoid('DtShowLoggerDialog'); },
  openMenuDialog(): void { dtExecVoid('DtShowMenuDialog'); },
  openWebView(url: string): void { try { (w.DtStartWebViewActivity as { execute?: (url: string) => void })?.execute?.(url); } catch { (window as unknown as Record<string, (url: string, target: string) => void>).open?.(url,'_blank'); } },
  openExternalUrl(url: string): void { try { (w.DtOpenExternalUrl as { execute?: (url: string) => void })?.execute?.(url); } catch { (window as unknown as Record<string, (url: string, target: string) => void>).open?.(url,'_blank'); } }
};

// --- Logs ---
export const logsAPI = {
  get(): string { return dtGetStr('DtGetLogs'); },
  clear(): void { dtExecVoid('DtClearLogs'); }
};

// --- Traducción ---
export const i18nAPI = {
  translate(key: string): string { return dtCall('DtTranslateText', key, (s: unknown)=> typeof s === 'string' ? s : key); }
};


// --- Sistema ---
export const systemAPI = {
  getConfigVersion(): string { return dtGetStr('DtGetLocalConfigVersion'); },
  startAppUpdate(): void { dtExecVoid('DtStartAppUpdate'); }
};

// --- Eventos nativos ---
export type DtunnelEventHandler<T = unknown> = (payload: T) => void;

export const eventsAPI = {
  on<T = unknown>(eventName: string, handler: DtunnelEventHandler<T>): void {
    (window as unknown as Record<string, unknown>)[eventName] = handler;
  },

  off(eventName: string): void {
    delete (window as unknown as Record<string, unknown>)[eventName];
  },

  register(listeners: Record<string, DtunnelEventHandler<unknown>>): void {
    Object.entries(listeners).forEach(([event, handler]) => {
      this.on(event, handler);
    });
  }
};

// --- Export principal ---
export const nativeAPI = {
  vpn: vpnAPI,
  network: networkAPI,
  hotspot: hotspotAPI,
  device: deviceAPI,
  config: configAPI,
  auth: authAPI,
  airplane: airplaneAPI,
  ui: uiAPI,
  logs: logsAPI,
  i18n: i18nAPI,
  system: systemAPI,
  events: eventsAPI
};

// Export por defecto para uso simple
export default nativeAPI;
