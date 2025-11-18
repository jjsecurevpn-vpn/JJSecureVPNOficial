/**
 * @file openExternal.ts
 * @description Helper centralizado para abrir URLs externas usando las APIs nativas disponibles
 */

/**
 * Abre una URL en el webview nativo si está disponible o hace fallback a window.open.
 * Se usa en múltiples botones (planes, soporte, términos, etc.) para evitar duplicación.
 */
export const openExternal = (url: string) => {
  try {
    if (window.DtOpenWebview) {
      window.DtOpenWebview.execute(url);
      return;
    }
    if (window.DtStartWebViewActivity) {
      window.DtStartWebViewActivity.execute(url);
      return;
    }
    window.open(url, '_blank');
  } catch (error) {
    console.warn('[openExternal] No se pudo abrir la URL', url, error);
    try { window.open(url, '_blank'); } catch {/* noop */}
  }
};

/** Constantes de layout y comportamiento para SettingsScreen */
export const SETTINGS_SCROLL_THRESHOLD = 20; // Distancia en px para considerar scrolled el contenido
export const SETTINGS_HEADER_BASE_PADDING = 68; // Base antes de sumar statusBarHeight + margen extra
export const SETTINGS_HEADER_EXTRA_PADDING = 12; // Margen adicional que ya estaba en el cálculo original
