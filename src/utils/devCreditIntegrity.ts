/**
 * devCreditIntegrity.ts
 * Sistema ligero de verificación y autoreparación del crédito del desarrollador.
 * Objetivo: Dificultar que se elimine el crédito "Dev: @JHServices - Todos los derechos reservados" sin romper integridad.
 * Nota: Ningún método en frontend es 100% infalible; esto solo eleva el costo de removerlo.
 */

// Fragmentamos el texto para evitar búsquedas simples en build plano.
const CREDIT_PARTS = [
  'Dev', ': ', '@JH', 'Services', ' - ', 'Todos', ' ', 'los', ' ', 'derechos', ' ', 'reservados'
];

const CREDIT_ID = 'dev-credit-signature';
const DATA_ATTR = 'data-dev-credit';
const FULL_TEXT = CREDIT_PARTS.join('');

// Pequeña firma (hash simple) para validar coincidencia.
function simpleHash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return (h >>> 0).toString(16);
}

const CREDIT_HASH = simpleHash(FULL_TEXT);

function buildCreditElement(): HTMLElement {
  const el = document.createElement('div');
  el.id = CREDIT_ID;
  el.setAttribute(DATA_ATTR, CREDIT_HASH);
  el.textContent = FULL_TEXT;
  
  // Obtener dimensiones de la ventana
  const vw = window.innerWidth;
  const scale = getResponsiveScale(vw);
  
  // Aplicar estilos responsive directamente
  el.style.fontSize = `${Math.max(scale * 10, 8)}px`;
  el.style.opacity = '0.85';
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.userSelect = 'text';
  el.style.textAlign = 'center';
  el.style.width = '100%';
  el.style.lineHeight = '1.2';
  el.style.padding = `${Math.max(scale * 8, 6)}px ${Math.max(scale * 12, 8)}px`;
  el.style.color = 'rgba(255, 255, 255, 0.7)';
  el.style.fontWeight = '300';
  el.style.letterSpacing = vw <= 320 ? '0px' : '0.25px';
  el.style.position = 'relative';
  el.style.zIndex = '10';
  el.style.minHeight = `${Math.max(scale * 32, 24)}px`;
  el.style.boxSizing = 'border-box';
  el.style.wordWrap = 'break-word';
  el.style.visibility = 'visible';
  el.style.fontFamily = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif';
  el.style.transition = 'all 0.3s ease';
  
  // Ajustes específicos para pantallas muy pequeñas
  if (vw <= 320) {
    el.style.fontSize = `${Math.max(scale * 8, 7)}px`;
    el.style.padding = `${Math.max(scale * 6, 4)}px ${Math.max(scale * 8, 6)}px`;
    el.style.minHeight = `${Math.max(scale * 28, 20)}px`;
    el.style.whiteSpace = 'nowrap';
    el.style.overflow = 'hidden';
    el.style.textOverflow = 'ellipsis';
  }
  
  // Función para actualizar estilos en resize
  const updateStyles = () => {
    const newVw = window.innerWidth;
    const newScale = getResponsiveScale(newVw);
    
    el.style.fontSize = `${Math.max(newScale * 10, 8)}px`;
    el.style.padding = `${Math.max(newScale * 8, 6)}px ${Math.max(newScale * 12, 8)}px`;
    el.style.minHeight = `${Math.max(newScale * 32, 24)}px`;
    el.style.letterSpacing = newVw <= 320 ? '0px' : '0.25px';
    
    if (newVw <= 320) {
      el.style.fontSize = `${Math.max(newScale * 8, 7)}px`;
      el.style.padding = `${Math.max(newScale * 6, 4)}px ${Math.max(newScale * 8, 6)}px`;
      el.style.minHeight = `${Math.max(newScale * 28, 20)}px`;
      el.style.whiteSpace = 'nowrap';
      el.style.overflow = 'hidden';
      el.style.textOverflow = 'ellipsis';
    } else {
      el.style.whiteSpace = 'normal';
      el.style.overflow = 'visible';
      el.style.textOverflow = 'clip';
    }
  };
  
  // Listener de resize con throttling
  let resizeTimeout: number | null = null;
  const resizeHandler = () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(updateStyles, 100);
  };
  
  window.addEventListener('resize', resizeHandler);
  
  // Cleanup cuando el elemento es removido
  const cleanupObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.removedNodes.forEach((node) => {
        if (node === el) {
          window.removeEventListener('resize', resizeHandler);
          if (resizeTimeout) clearTimeout(resizeTimeout);
          cleanupObserver.disconnect();
        }
      });
    });
  });
  
  // Observar cuando el elemento se añade al DOM para configurar cleanup
  setTimeout(() => {
    if (el.parentNode) {
      cleanupObserver.observe(el.parentNode, { childList: true });
    }
  }, 100);
  
  return el;
}

// Función auxiliar para calcular la escala responsiva
function getResponsiveScale(viewportWidth: number): number {
  if (viewportWidth <= 280) return 0.7;
  if (viewportWidth <= 320) return 0.8;
  if (viewportWidth <= 360) return 0.85;
  if (viewportWidth <= 400) return 0.9;
  if (viewportWidth <= 450) return 0.95;
  return 1.0;
}

let observerStarted = false;

export function startDevCreditIntegrity(): void {
  if (typeof document === 'undefined') return;
  if (observerStarted) return;
  observerStarted = true;

  // Función para insertar el crédito
  const insertCredit = () => {
    try {
      // Buscar el contenedor específico del footer de configuraciones
      const container = document.querySelector('[data-settings-footer-section]') as HTMLElement;
      if (!container) {
        return false;
      }

      // Verificar si ya existe el crédito
      const existing = document.getElementById(CREDIT_ID);
      if (existing && existing.textContent === FULL_TEXT) {
        return true;
      }

      // Limpiar contenedor y crear nuevo elemento
      if (existing) existing.remove();
      container.innerHTML = ''; // Limpiar completamente
      
      const creditElement = buildCreditElement();
      container.appendChild(creditElement);
      
      console.log('[INTEGRIDAD] Crédito de desarrollador insertado correctamente en SettingsScreen');
      return true;
    } catch (error) {
      console.error('[INTEGRIDAD] Error al insertar crédito:', error);
      return false;
    }
  };

  // Inserción inicial con reintentos más agresivos
  const attemptInsert = () => {
    if (!insertCredit()) {
      retryCount++;
      if (retryCount < 20) { // Más reintentos
        const delay = retryCount < 5 ? 100 : retryCount < 10 ? 300 : 1000;
        setTimeout(attemptInsert, delay);
      } else {
        console.warn('[INTEGRIDAD] No se pudo insertar el crédito después de múltiples intentos');
      }
    }
  };
  
  let retryCount = 0;
  
  // Intentar inserción inmediatamente
  attemptInsert();
  
  // También intentar después del DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(attemptInsert, 100);
    });
  }

  // Observador simplificado que solo vigila cambios en el contenedor específico
  const observer = new MutationObserver(() => {
    try {
      const container = document.querySelector('[data-settings-footer-section]');
      const existing = document.getElementById(CREDIT_ID);
      
      if (container && !existing) {
        insertCredit();
      }
    } catch (error) {
      console.error('[INTEGRIDAD] Error en observador:', error);
    }
  });
  
  // Observar solo el contenedor específico cuando aparezca
  const findAndObserveContainer = () => {
    const container = document.querySelector('[data-settings-footer-section]');
    if (container) {
      observer.observe(container, { 
        childList: true, 
        subtree: false,
        attributes: false,
        characterData: false
      });
      return true;
    }
    return false;
  };

  // Intentar encontrar y observar el contenedor
  if (!findAndObserveContainer()) {
    // Si no existe aún, observar todo el documento hasta encontrarlo
    const globalObserver = new MutationObserver(() => {
      if (findAndObserveContainer()) {
        globalObserver.disconnect();
        insertCredit(); // Insertar inmediatamente cuando se encuentre
      }
    });
    
    globalObserver.observe(document.documentElement, { 
      childList: true, 
      subtree: true,
      attributes: false,
      characterData: false
    });
    
    // Desconectar el observador global después de 10 segundos
    setTimeout(() => {
      globalObserver.disconnect();
    }, 10000);
  }
}

export function getDevCreditInfo() {
  return { text: FULL_TEXT, hash: CREDIT_HASH, id: CREDIT_ID };
}

// Hook para uso en componentes React
import { useEffect } from 'react';
export function useDevCreditIntegrity() {
  useEffect(() => {
    startDevCreditIntegrity();
  }, []);
}
