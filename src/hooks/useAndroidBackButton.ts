import { useEffect, useRef } from "react";
import { setAndroidBackButtonListener } from "../utils/appFunctions";

interface UseAndroidBackButtonProps {
  isActive: boolean;
  onBackPressed: () => void;
  priority?: number; // Mayor = más arriba en la pila
  /**
   * Si se devuelve true el evento se consume y no continúa a handlers inferiores.
   * Útil para flujos internos antes de cerrar el modal.
   */
  intercept?: () => boolean;
  /** Indica que este listener NO debe cerrar un bottom sheet ligero (p.e. panel informativo). */
  ignoreIfBottomSheet?: boolean;
}

/**
 * Hook básico para manejar el botón back de Android en componentes específicos
 * 
 * ⚠️  IMPORTANTE: Este hook es para casos específicos de componentes individuales.
 *     Para navegación global de la app, usar useAppNavigation en App.tsx
 * 
 * Uso recomendado:
 * - Modales con navegación interna compleja
 * - Componentes que necesitan comportamiento específico de back
 * - Casos donde el flujo global no aplica
 * 
 * Detecta cuando el usuario presiona el botón back y ejecuta una acción personalizada
 * Incluye soporte tanto para la funcionalidad nativa de Android como para navegadores web
 */
/**
 * Pila global mejorada con prioridades y capacidad de interceptación.
 * La lógica de prioridad: se ordena desc por priority y luego LIFO.
 */
export function useAndroidBackButton({
  isActive,
  onBackPressed,
  priority = 0,
  intercept,
  ignoreIfBottomSheet = false,
}: UseAndroidBackButtonProps) {
  const handlerRef = useRef(onBackPressed);
  handlerRef.current = onBackPressed;
  const interceptRef = useRef(intercept);
  interceptRef.current = intercept;

  useEffect(() => {
    if (!isActive) return;

    const w = window as any;
  const stack: Array<{ fn: () => void; priority: number; intercept?: () => boolean; ignoreIfBottomSheet?: boolean; id: number }> = (w.__BACK_STACK ||= []);
    const id = Date.now() + Math.random();

    const entry = {
      fn: () => handlerRef.current?.(),
      priority,
      intercept: interceptRef.current ? () => interceptRef.current?.() === true : undefined,
      ignoreIfBottomSheet,
      id,
    };

    stack.push(entry);
    // Mantener orden (desc) por priority
    stack.sort((a,b) => b.priority - a.priority || b.id - a.id);

    // Si el controlador global de la app está activo, NO registrar listener propio; solo usar la pila.
  if (!w.__GLOBAL_APP_BACK && !w.__BACK_DISPATCHER__) {
      const dispatcher = () => {
        // Detectar si hay bottom sheet visible (heurística: .bottom-sheet presente y transform sin translateY-full)
        const sheet = document.querySelector('.bottom-sheet');
        const sheetVisible = sheet && !/(translateY\(100%|translateY\(\d+px\))/i.test(sheet.getAttribute('style') || '') && sheet.className.includes('translate-y-0');

        for (const item of [...stack]) {
          if (sheetVisible && item.ignoreIfBottomSheet) continue; // saltar handlers que no deben cerrar sheet
          try {
            if (item.intercept && item.intercept()) return; // intercepta sin cerrar
            item.fn();
            return;
          } catch {}
        }
      };
      w.__BACK_DISPATCHER__ = dispatcher;
      setAndroidBackButtonListener(dispatcher);
      window.addEventListener('keydown', (e) => { if (e.key === 'Escape') dispatcher(); });
      // Web fallback history
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', (ev) => { ev.preventDefault(); window.history.pushState(null, '', window.location.href); dispatcher(); });
    }

    return () => {
      const idx = stack.findIndex(s => s.id === id);
      if (idx >= 0) stack.splice(idx, 1);
    };
  }, [isActive, priority, ignoreIfBottomSheet]);
}

// Helper para registrar manualmente (p.e. en sistemas sin hook React)
export function registerAndroidBackHandler(fn: () => void, priority = 0) {
  const w = window as any;
  const stack: Array<{ fn: () => void; priority: number; id: number }> = (w.__BACK_STACK ||= []);
  const id = Date.now() + Math.random();
  stack.push({ fn, priority, id });
  stack.sort((a,b) => b.priority - a.priority || b.id - a.id);
  return () => {
    const idx = stack.findIndex(s => s.id === id);
    if (idx >= 0) stack.splice(idx, 1);
  };
}
