import { useEffect, useRef, Dispatch, SetStateAction } from "react";
import {
  setAndroidBackButtonListener,
  removeAndroidBackButtonListener,
} from "../utils";

export interface NavigationState {
  currentModal: unknown;
  showWelcomeScreen: boolean;
  activeTab: string;
}

export interface NavigationActions<TModal = string | null> {
  setCurrentModal: Dispatch<SetStateAction<TModal>>;
  setShowWelcomeScreen: (show: boolean) => void;
  handleFooterNavigation: (tab: string) => void;
}

export function useAppNavigation<TModal = string | null>(
  navigationState: NavigationState,
  navigationActions: NavigationActions<TModal>
) {
  const stateRef = useRef(navigationState);
  const actionsRef = useRef(navigationActions);
  const handlingBackRef = useRef(false);

  // Mantener refs actualizadas con el último estado/acciones
  useEffect(() => {
    stateRef.current = navigationState;
    actionsRef.current = navigationActions;
  }, [navigationState, navigationActions]);

  useEffect(() => {
    // Señal global para evitar que hooks de componentes registren nativo de nuevo
    const w = window as unknown as Record<string, unknown>;
    w.__GLOBAL_APP_BACK = true;
    if (!w.__BACK_STACK) {
      w.__BACK_STACK = [] as unknown[];
    }

    const beginHandle = () => {
      if (handlingBackRef.current) return false;
      handlingBackRef.current = true;
      setTimeout(() => {
        handlingBackRef.current = false;
      }, 200);
      return true;
    };

    const ensureHistoryTrap = () => {
      try {
        window.history.pushState({ trap: "back" }, "", window.location.href);
      } catch {
        // Error al pushState (puede ocurrir en algunos entornos)
      }
    };

    const handleBackPress = () => {
      if (!beginHandle()) return true;

      const {
        currentModal,
        showWelcomeScreen,
        activeTab,
      } = stateRef.current;
      const {
        setCurrentModal,
        setShowWelcomeScreen,
        handleFooterNavigation,
      } = actionsRef.current;

      // 1) Modales
      if (currentModal) {
        setCurrentModal(null as unknown as TModal);
        ensureHistoryTrap();
        return true;
      }
      // 2) Cualquier pantalla/tab distinto a HOME -> ir a HOME
      if (activeTab !== "home") {
        handleFooterNavigation("home");
        ensureHistoryTrap();
        return true;
      }
      // 3) Pantallas especiales (welcome) -> cerrar y asegurar HOME
      if (showWelcomeScreen) {
        setShowWelcomeScreen(false);
        handleFooterNavigation("home");
        ensureHistoryTrap();
        return true;
      }

      // 4) Si estamos en HOME, permitir handlers específicos (p.e. cerrar sheets ligeros)
      const stack = w.__BACK_STACK as Array<{ intercept?: () => boolean; fn?: () => void } | (() => void)> || [];
      if (stack.length > 0) {
        const top = stack[stack.length - 1];
        try {
          if (typeof top === 'function') {
            top();
          } else if (top && typeof top === 'object') {
            const handler = top as { intercept?: () => boolean; fn?: () => void };
            if (typeof handler.intercept === 'function' && handler.intercept()) {
              // Interceptado sin cerrar
            } else if (typeof handler.fn === 'function') {
              handler.fn();
            }
          }
        } catch {
          // Error en handler, continuar
        }
        ensureHistoryTrap();
        return true;
      }

      // 5) HOME sin handlers -> Confirmar salida
      setCurrentModal("exitconfirm" as unknown as TModal);
      ensureHistoryTrap();
      return true;
    };

    const handleWebBackButton = (event: PopStateEvent) => {
      event.preventDefault?.();
      handleBackPress();
      ensureHistoryTrap();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleBackPress();
        ensureHistoryTrap();
      }
    };

    const nativeSuccess = setAndroidBackButtonListener(handleBackPress);
    w.__NATIVE_BACK_ACTIVE = !!nativeSuccess;

    ensureHistoryTrap();
    window.addEventListener("popstate", handleWebBackButton);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (w.__NATIVE_BACK_ACTIVE) {
        removeAndroidBackButtonListener();
      }
      window.removeEventListener("popstate", handleWebBackButton);
      window.removeEventListener("keydown", handleKeyDown);
      w.__GLOBAL_APP_BACK = false;
    };
  }, []);

  return {
    isInHomeState:
  !navigationState.currentModal &&
  !navigationState.showWelcomeScreen &&
  navigationState.activeTab === "home",
  };
}
