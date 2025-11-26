// DEPRECADO: Este archivo ha sido reemplazado por unifiedEventsSystem.ts
// Se mantiene solo para compatibilidad temporal

import { 
  onDtunnelEvent as newOnDtunnelEvent,
  emitDtunnelEvent as newEmitDtunnelEvent} from "./unifiedEventsSystem";

// Tipos de eventos disponibles y sus payloads (DEPRECADOS)
/**
 * @deprecated Usar DtunnelEventPayloads['DtCheckUserResultEvent'] de unifiedEventsSystem en su lugar
 */
export interface DtCheckUserModelEventPayload {
  expiration_days: string;
  limit_connections: string;
  expiration_date: string;
  username: string;
  count_connections: string;
}

/**
 * @deprecated Usar DtunnelEventPayloads['DtConfigSelectedEvent'] de unifiedEventsSystem en su lugar
 */
export interface DtConfigSelectedEventPayload {
  id: number;
  name: string;
  description: string;
  mode: string;
  sorter?: number;
  icon?: string;
  auth?: { v2ray_uuid?: string };
  category_id?: number;
  config_openvpn?: string;
  config_payload?: { payload?: string; sni?: string };
  config_v2ray?: string;
  dns_server?: { dns1?: string; dns2?: string };
  dnstt_key?: string;
  dnstt_name_server?: string;
  dnstt_server?: string;
  proxy?: { host?: string; port?: number };
  server?: { host?: string; port?: number };
  tls_version?: string;
  udp_ports?: number[];
  url_check_user?: string;
  [key: string]: unknown;
}

/**
 * @deprecated Usar DtunnelEventPayloads['DtVpnStateEvent'] de unifiedEventsSystem en su lugar
 */
export type DtVpnStateEventPayload =
  | "STOPPING"
  | "CONNECTING"
  | "CONNECTED"
  | "AUTH"
  | "AUTH_FAILED"
  | "DISCONNECTED";

/**
 * @deprecated Usar DtunnelEventPayloads de unifiedEventsSystem en su lugar
 */
export interface DtHotspotStateEventPayload {
  state: "RUNNING" | "STOPPED";
}

/**
 * @deprecated Usar DtunnelEventPayloads de unifiedEventsSystem en su lugar
 */
export interface DtNetworkStatsEventPayload {
  downloadBytes: number;
  uploadBytes: number;
  downloadSpeed: string;
  uploadSpeed: string;
}

/**
 * @deprecated Usar DtunnelEventPayloads de unifiedEventsSystem en su lugar
 */
export interface DtLocalIPEventPayload {
  ip: string;
}

/**
 * @deprecated Usar DtunnelEventPayloads de unifiedEventsSystem en su lugar
 */
export interface DtAirplaneModeEventPayload {
  enabled: boolean;
}

/**
 * @deprecated Usar DtunnelEventPayloads de unifiedEventsSystem en su lugar
 */

/**
 * @deprecated Usar DtunnelEventPayloads de unifiedEventsSystem en su lugar
 */
export type DtunnelEventMap = {
  DtCheckUserStartedEvent: undefined;
  DtCheckUserModelEvent: DtCheckUserModelEventPayload;
  DtNewDefaultConfigEvent: undefined;
  DtMessageErrorrEvent: undefined;
  DtNewLogEvent: undefined;
  DtErrorToastEvent: undefined;
  DtSuccessToastEvent: undefined;
  DtVpnStartedSuccessEvent: undefined;
  DtVpnStateEvent: DtVpnStateEventPayload;
  DtVpnStoppedSuccessEvent: undefined;
  DtConfigSelectedEvent: DtConfigSelectedEventPayload;
  DtHotspotStateEvent: DtHotspotStateEventPayload;
  DtNetworkStatsEvent: DtNetworkStatsEventPayload;
  DtLocalIPEvent: DtLocalIPEventPayload;
  DtAirplaneModeEvent: DtAirplaneModeEventPayload;
};

/**
 * @deprecated Usar keyof DtunnelEventPayloads de unifiedEventsSystem en su lugar
 */
export type DtunnelEvent = keyof DtunnelEventMap;

/**
 * @deprecated Usar onDtunnelEvent de unifiedEventsSystem en su lugar
 */
export function onDtunnelEvent<K extends DtunnelEvent>(
  event: K,
  handler: (payload: DtunnelEventMap[K]) => void
) {
  console.warn(`⚠️ dtEvents.onDtunnelEvent está deprecado. Usar onDtunnelEvent de unifiedEventsSystem en su lugar.`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return newOnDtunnelEvent(event as any, handler as any);
}

/**
 * @deprecated Usar emitDtunnelEvent de unifiedEventsSystem en su lugar
 */
export function emitDtunnelEvent<K extends DtunnelEvent>(
  event: K,
  payload: DtunnelEventMap[K]
) {
  console.warn(`⚠️ dtEvents.emitDtunnelEvent está deprecado. Usar emitDtunnelEvent de unifiedEventsSystem en su lugar.`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  newEmitDtunnelEvent(event as any, payload as any);
}
