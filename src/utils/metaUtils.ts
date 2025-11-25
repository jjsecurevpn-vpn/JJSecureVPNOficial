/**
 * @file metaUtils.ts
 * @description Utilidades SIMPLIFICADAS para manipulación de meta tags usando APIs nativas
 */

import { nativeAPI } from "./unifiedNativeAPI";

export interface BrowserColorConfig {
  themeColor: string;
  statusBarStyle?: 'default' | 'black-translucent';
}

/**
 * Actualiza meta tags del navegador (para web) y APIs nativas (para móvil)
 * SIMPLIFICADO: Usa directamente la API nativa cuando está disponible
 */
export const updateBrowserColors = (config: BrowserColorConfig) => {
  const { themeColor, statusBarStyle = 'black-translucent' } = config;
  
  // 1. PRIMERA PRIORIDAD: API nativa (más eficiente en móvil)
  nativeAPI.device.setNavigationBarColor(themeColor);
  
  // 2. SEGUNDA PRIORIDAD: Meta tags como fallback para web
  updateMetaTags(themeColor, statusBarStyle);
};

/**
 * Actualiza solo los meta tags (fallback para entornos web)
 */
const updateMetaTags = (themeColor: string, statusBarStyle: string) => {
  // Theme color principal
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', themeColor);
  }
  
  // Meta tags adicionales para diferentes navegadores
  const metaTags = [
    { name: 'msapplication-navbutton-color', content: themeColor },
    { name: 'mobile-web-app-status-bar-style', content: themeColor },
    { name: 'msapplication-TileColor', content: themeColor }
  ];
  
  metaTags.forEach(({ name, content }) => {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  });
  
  // Apple status bar style
  const appleStatusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (appleStatusBarMeta) {
    appleStatusBarMeta.setAttribute('content', statusBarStyle);
  }
};

/**
 * SIMPLIFICADO: Aplica tema usando API nativa con fallback automático
 */
export const applyBrowserTheme = (
  themeColor: string, 
  statusBarStyle?: 'default' | 'black-translucent'
) => {
  // Aplicar inmediatamente
  updateBrowserColors({ themeColor, statusBarStyle });
  
  // Reintentos automáticos para asegurar que funcione
  const retryIntervals = [100, 500, 1000];
  retryIntervals.forEach(delay => {
    setTimeout(() => {
      nativeAPI.device.setNavigationBarColor(themeColor);
    }, delay);
  });
  
  // Reaplica al enfocar la ventana
  const handleFocus = () => {
    updateBrowserColors({ themeColor, statusBarStyle });
  };
  
  window.addEventListener('focus', handleFocus);
  
  return () => {
    window.removeEventListener('focus', handleFocus);
  };
};
