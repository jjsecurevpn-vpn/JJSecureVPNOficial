import { useEffect, useRef } from "react";
import { androidBackManager, type AndroidBackHandlerOptions } from "../utils/androidBackManager";

interface UseAndroidBackButtonProps extends AndroidBackHandlerOptions {
  isActive: boolean;
  onBackPressed: () => void;
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
  const interceptRef = useRef(intercept);

  useEffect(() => {
    handlerRef.current = onBackPressed;
  }, [onBackPressed]);

  useEffect(() => {
    interceptRef.current = intercept;
  }, [intercept]);

  useEffect(() => {
    if (!isActive) return;
    const unregister = androidBackManager.register(() => handlerRef.current?.(), {
      priority,
      ignoreIfBottomSheet,
      intercept: interceptRef.current,
    });
    return () => {
      unregister();
    };
  }, [isActive, priority, ignoreIfBottomSheet]);
}

// Helper para registrar manualmente (p.e. en sistemas sin hook React)
export function registerAndroidBackHandler(fn: () => void, priority = 0) {
  return androidBackManager.registerManual(fn, priority);
}
