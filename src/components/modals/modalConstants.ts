// Centralización de constantes y utilidades para modales
// Mantener cambios aquí coherentes con estilos Tailwind

export const MODAL_ANIMATION_MS = 200; // Duración de entrada / salida
// Z-index elevados para asegurar estar sobre header (header usa 1000)
export const MODAL_Z_OVERLAY = 3000;
export const MODAL_Z_CONTAINER = 3010;

export const DEFAULT_MODAL_HEIGHT_PERCENT = 85; // Porcentaje pasado a getModalStyle
export const DEFAULT_MODAL_MIN_HEIGHT = 200; // px
export const DEFAULT_MODAL_MAX_HEIGHT_VH = 90; // vh

export const MODAL_SIDE_PADDING = 16; // px
export const MODAL_VERTICAL_SAFE_PADDING = 8; // px extra sobre safe areas

// Helper para esperar fin de animación antes de desmontar
export function runAfterAnimation(cb: () => void, ms: number = MODAL_ANIMATION_MS) {
  const id = setTimeout(cb, ms);
  return () => clearTimeout(id);
}

// --- Bottom Sheet (variantes tipo FreeServersInfo) ---
export const BOTTOM_SHEET_OPEN_MS = 200; // similar a modales
export const BOTTOM_SHEET_CLOSE_MS = 300; // cierre más suave
export const BOTTOM_SHEET_MAX_HEIGHT_VH = 60;
export const BOTTOM_SHEET_MIN_HEIGHT_VH = 40;

export const FREE_SERVER_KEYWORDS = ["gratuito", "free", "gratis"] as const;
export const PREMIUM_SERVER_KEYWORDS = ["premium", "vip", "pro"] as const;

export interface ProtocolInfo {
  name: string;
  bg: string;
  color?: string;
}

interface ProtocolPattern { test: (id: string) => boolean; info: ProtocolInfo; }

export const PROTOCOL_PATTERNS: ProtocolPattern[] = [
  { test: id => /v2|v2ray/i.test(id), info: { name: 'V2Ray', bg: 'protocol-v2ray' } },
  { test: id => /ssh/i.test(id), info: { name: 'SSH', bg: 'protocol-ssh' } },
  { test: id => /ssl|tls/i.test(id), info: { name: 'SSL', bg: 'protocol-ssl' } },
  { test: id => /slow|dns/i.test(id), info: { name: 'SlowDNS', bg: 'protocol-slowdns' } },
  { test: id => /udp/i.test(id), info: { name: 'UDP', bg: 'protocol-udp' } },
];

export function detectProtocol(id: string): ProtocolInfo {
  const pattern = PROTOCOL_PATTERNS.find(p => p.test(id));
  return pattern ? pattern.info : { name: 'HTTP', bg: 'protocol-generic' };
}

export const THEME_PURPLE = {
  primary: 'rgb(167 139 250)', // primary-400
  primaryLight: 'rgb(196 181 253)',
  primaryDark: 'rgb(124 58 237)',
};
