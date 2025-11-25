import { useEffect, useRef } from "react";
import {
  setAndroidBackButtonListener,
  removeAndroidBackButtonListener,
} from "../utils";

export interface NavigationState {
  currentModal: any;
  showWelcomeScreen: boolean;
  activeTab: string;
}

export interface NavigationActions {
  setCurrentModal: (modal: any) => void;
  setShowWelcomeScreen: (show: boolean) => void;
  handleFooterNavigation: (tab: string) => void;
}

export function useAppNavigation(
  navigationState: NavigationState,
  navigationActions: NavigationActions
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
    (window as any).__GLOBAL_APP_BACK = true;
    if (!(window as any).__BACK_STACK) {
      (window as any).__BACK_STACK = [] as Array<() => void>;
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
      } catch {}
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
        setCurrentModal(null);
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
      const stack: any[] = (window as any).__BACK_STACK || [];
      if (stack.length > 0) {
        const top: any = stack[stack.length - 1];
        try {
          if (typeof top === 'function') {
            top();
          } else if (top && typeof top === 'object') {
            if (typeof top.intercept === 'function' && top.intercept()) {
              // Interceptado sin cerrar
            } else if (typeof top.fn === 'function') {
              top.fn();
            }
          }
        } catch {}
        ensureHistoryTrap();
        return true;
      }

      // 5) HOME sin handlers -> Confirmar salida
      setCurrentModal("exitconfirm");
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

    const nativeSuccess = setAndroidBackButtonListener(handleBackPress as any);
    (window as any).__NATIVE_BACK_ACTIVE = !!nativeSuccess;

    ensureHistoryTrap();
    window.addEventListener("popstate", handleWebBackButton);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if ((window as any).__NATIVE_BACK_ACTIVE) {
        removeAndroidBackButtonListener();
      }
      window.removeEventListener("popstate", handleWebBackButton);
      window.removeEventListener("keydown", handleKeyDown);
      (window as any).__GLOBAL_APP_BACK = false;
    };
  }, []);

  return {
    isInHomeState:
  !navigationState.currentModal &&
  !navigationState.showWelcomeScreen &&
  navigationState.activeTab === "home",
  };
}
