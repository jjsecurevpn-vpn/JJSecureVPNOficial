// Declaraciones globales DTunnel: expone las interfaces mínimas para evitar errores TS.
// Mantener este archivo sincronizado con las funciones efectivamente usadas en unifiedNativeAPI.

export interface DtExecutable<T = unknown> {
  execute: (...args: unknown[]) => T;
}
export interface DtKV<T = string> {
  get: () => T | undefined;
  set: (value: T) => void;
}
declare global {
interface Window {
  // VPN
  DtGetVpnState?: DtExecutable<string>;
  DtExecuteVpnStart?: DtExecutable<void>;
  DtExecuteVpnStop?: DtExecutable<void>;

  // Network bytes & info
  DtGetNetworkDownloadBytes?: DtExecutable<number>;
  DtGetNetworkUploadBytes?: DtExecutable<number>;
  DtGetLocalIP?: DtExecutable<string>;
  DtGetPingResult?: DtExecutable<number>;
  DtGetNetworkData?: DtExecutable<string>; // se parsea a objeto externamente

  // Hotspot
  DtGetStatusHotSpotService?: DtExecutable<string>;
  DtStartHotSpotService?: DtExecutable<void>;
  DtStopHotSpotService?: DtExecutable<void>;

  // Device / UI
  DtGetStatusBarHeight?: DtExecutable<number>;
  DtGetNavigationBarHeight?: DtExecutable<number>;
  DtSetNavigationBarColor?: DtExecutable<void>;
  DtAppVersion?: DtExecutable<string>;
  DtGetDeviceID?: DtExecutable<string>;
  DtExecuteDialogConfig?: DtExecutable<void>;
  DtShowLoggerDialog?: DtExecutable<void>;
  DtShowMenuDialog?: DtExecutable<void>;
  DtStartWebViewActivity?: DtExecutable<void>;
  DtOpenExternalUrl?: DtExecutable<void>;

  // Configs
  DtGetConfigs?: DtExecutable<string>;
  DtGetDefaultConfig?: DtExecutable<string>;
  DtSetConfig?: DtExecutable<void>;

  // Auth storage
  DtUsername?: DtKV<string>;
  DtPassword?: DtKV<string>;
  DtUuid?: DtKV<string>;
  DtStartCheckUser?: DtExecutable<void>;

  // Airplane Mode
  DtAirplaneState?: DtExecutable<string>;
  DtAirplaneActivate?: DtExecutable<void>;
  DtAirplaneDeactivate?: DtExecutable<void>;

  // Logs
  DtGetLogs?: DtExecutable<string>;
  DtClearLogs?: DtExecutable<void>;

  // i18n
  DtTranslateText?: DtExecutable<string>;


  // System
  DtGetLocalConfigVersion?: DtExecutable<string>;
  DtStartAppUpdate?: DtExecutable<void>;
  DtStartApnActivity?: DtExecutable<void>;
  DtIgnoreBatteryOptimizations?: DtExecutable<boolean>;
}
}

export {}; // asegura módulo y aplica la augmentation
