import { useState, useEffect, useCallback } from "react";
import { useFooterSwipeNavigation } from "./hooks/useSwipeNavigation";
import { SwipeIndicator } from "./components/ui/SwipeIndicator";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { BottomSheetServerSelector } from "./components/BottomSheetServerSelector/index";
import MapLatAmVPN from "./components/MapLatAmVPN/MapLatAmVPN.tsx";
import { SettingsScreen } from "./components/screens/SettingsScreen/SettingsScreen";
import { ServerSelectorScreen } from "./components/screens/ServerSelectorScreen/ServerSelectorScreen";
import { WelcomeScreen } from "./components/screens/welcome/WelcomeScreen";
import { modalComponents } from "./components/modals/modalComponents.tsx";
import { UserProfileScreen } from "./components/screens/UserProfileScreen";
import {
  getStorageItem,
  setStorageItem,
  saveRecentConnection,
  resetWelcomeScreen,
} from "./utils/storageUtils";
import { ActiveConfigProvider } from "./context/ActiveConfigContext";
import { ThemeProvider } from "./context/ThemeContext";
import { TutorialProvider } from "./context/TutorialContext";
import { LanguageProvider } from "./context/LanguageContext";
import { TutorialOverlay } from "./components/tutorial/TutorialOverlay";
import { useAppLayout } from "./hooks/useAppLayout";
import { useAppNavigation } from "./hooks/useAppNavigation";
import { useAutoTutorial } from "./hooks/useAutoTutorial";
import { useUnifiedVpn } from "./hooks/useUnifiedVpn";
// (Eliminado: antiguo useVpnIP reemplazado por useIPInfo)
// import { useModalRenderer } from "./hooks/useModalRenderer"; // Temporalmente deshabilitado
import { nativeAPI } from "./utils";
import { footerTabs } from "./constants/navigationConfig";
import { NativeConnectionRecovery } from "./utils/nativeConnectionRecovery";
import TvModeScreen from "./components/screens/TvModeScreen/TvModeScreen";

export type ModalType =
  | null
  | "terms"
  | "privacy"
  | "cleandata"
  | "hotspot"
  | "checkuser"
  | "credentials" // Modal de credenciales
  | "missingcredentials" // Advertencia: faltan credenciales
  | "missingserver" // Advertencia: falta seleccionar servidor
  | "missingsetup" // Advertencia: faltan ambas cosas
  | "welcome" // Pantalla de bienvenida
  | "buy" // Pantalla de compra
  | "serverselector" // Modal de selector de servidor
  | "download"; // Pantalla de descarga

function App() {
  // Hooks de eventos integrados para sincronización automática
  const vpnEvents = useUnifiedVpn();

  // Estados locales del App
  const [currentModal, setCurrentModal] = useState<ModalType>(null);
  const [activeTab, setActiveTab] = useState<string>("home");
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(() => {
    const hasSeenWelcome = getStorageItem<boolean>("app-welcome-completed");
    return !hasSeenWelcome;
  });

  // Trigger para re-render cuando cambia el modo preferido sin recargar
  const [, setPreferredModeTick] = useState(0);

  // Estado para errores de conexión
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Obtener estado VPN actual desde los eventos
  const vpnState = vpnEvents.state;

  const { containerStyle } = useAppLayout();

  // Función para manejar la navegación del footer
  const handleFooterNavigation = (tab: string) => {
    setActiveTab(tab);
    setCurrentModal(null);

    if (tab === "home") {
      setShowWelcomeScreen(false);
      // Limpia posibles mensajes de error tras cerrar overlays
      setTimeout(() => setConnectionError(null), 50);
    }
  };

  // Hook para navegación por swipe entre tabs del footer
  const tabIds = footerTabs.map((tab) => tab.id);
  const { onTouchStart, onTouchMove, onTouchEnd, indicator } =
    useFooterSwipeNavigation(tabIds, activeTab, handleFooterNavigation);

  // Hook mejorado para navegación con botón back de Android
  useAppNavigation(
    {
      currentModal,
      showWelcomeScreen,
      activeTab,
    },
    {
      setCurrentModal,
      setShowWelcomeScreen,
      handleFooterNavigation,
    }
  );

  // Función global para development/testing (disponible en console del navegador)
  useEffect(() => {
    // Inicializar sistema de recuperación de conexión nativa
    const nativeRecovery = new NativeConnectionRecovery(
      () => {
        // Solo mostrar error si el sistema está activo (entorno nativo)
        if (nativeRecovery.isActive()) {
          console.warn("🔴 CONEXIÓN NATIVA PERDIDA - Sistemas VPN afectados");
          setConnectionError(
            "Conexión con sistemas nativos perdida. Intentando reconectar..."
          );
        }
      },
      () => {
        // Solo manejar restauración si el sistema está activo
        if (nativeRecovery.isActive()) {
          console.log(
            "🟢 CONEXIÓN NATIVA RESTAURADA - Sistemas VPN disponibles"
          );
          setConnectionError(null);
        }
      }
    );

    if (typeof window !== "undefined") {
      (window as any).resetWelcome = () => {
        resetWelcomeScreen();
        setShowWelcomeScreen(true);
        console.log("Welcome screen reset - will show on next app start");
      };

      (window as any).showWelcome = () => {
        setShowWelcomeScreen(true);
        console.log("Welcome screen shown");
      };

      // Función para resetear el tutorial y simular primera vez
      (window as any).resetTutorial = () => {
        localStorage.removeItem("jjsecure-tutorial-completed");
        console.log("Tutorial reset - will show on next visit");
        window.location.reload(); // Recargar para aplicar el cambio
      };

      // Exponer el sistema de recuperación para debugging
      (window as any).nativeRecovery = nativeRecovery;

      // Nuevo evento global para mostrar notificaciones enriquecidas
    }

    // Cleanup del sistema de recuperación
    return () => {
      nativeRecovery.cleanup();
    };
  }, []);

  // Escuchar cambios de modo preferido (evento interno) para re-render sin reload
  useEffect(() => {
    const onModeChange = () => setPreferredModeTick((v) => v + 1);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "@sshproject:preferred-mode") onModeChange();
    };
    if (typeof window !== "undefined") {
      window.addEventListener(
        "preferred-mode-change",
        onModeChange as EventListener
      );
      window.addEventListener("storage", onStorage);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "preferred-mode-change",
          onModeChange as EventListener
        );
        window.removeEventListener("storage", onStorage);
      }
    };
  }, []);

  // Función para abrir planes premium en webview
  const handleOpenPricingScreen = useCallback(() => {
    setShowWelcomeScreen(false); // Cierra el sidebar
    // Abre el enlace externo en webview
    if (window.DtOpenWebview) {
      window.DtOpenWebview.execute("https://shop.jhservices.com.ar/planes");
    } else if (window.DtStartWebViewActivity) {
      window.DtStartWebViewActivity.execute(
        "https://shop.jhservices.com.ar/planes"
      );
    } else {
      // Fallback para desarrollo
      window.open("https://shop.jhservices.com.ar/planes", "_blank");
    }
  }, []);

  // Configurar el color de la barra de navegación de Android
  useEffect(() => {
    // Color gris oscuro que coincide con el final del gradiente del footer
    // Usar color de superficie principal en vez de hex crudo
    const androidNavigationBarColor = "#23232f";

    // Cambiar el color de la barra de navegación en Android
    if (typeof window !== "undefined" && window.DtSetNavigationBarColor) {
      window.DtSetNavigationBarColor.execute(androidNavigationBarColor);
    }

    // Método alternativo para la barra de navegación
    if (
      typeof window !== "undefined" &&
      (window as any).Android &&
      (window as any).Android.setNavigationBarColor
    ) {
      (window as any).Android.setNavigationBarColor(androidNavigationBarColor);
    }

    // También intentar con el meta tag estándar para PWA
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", androidNavigationBarColor);
    } else {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = androidNavigationBarColor;
      document.head.appendChild(meta);
    }

    // Método adicional para asegurar que se aplique
    if (typeof window !== "undefined" && (window as any).setStatusBarColor) {
      (window as any).setStatusBarColor(androidNavigationBarColor);
    }
  }, []);

  // Reaccionar a cambios en el estado VPN desde hook unificado
  useEffect(() => {
    if (vpnEvents.isConnected) {
      try {
        const activeConfig = nativeAPI.config.getActive();
        if (activeConfig) {
          saveRecentConnection({
            id: activeConfig.id,
            name: activeConfig.name,
            category_id: activeConfig.category_id,
            categoryName: activeConfig.categoryName || "Sin categoría",
            categoryColor:
              activeConfig.categoryColor || "rgb(var(--primary-600))",
            mode: activeConfig.mode,
          });
        }
      } catch (error) {
        console.warn("Error guardando conexión reciente:", error);
      }
    }
  }, [vpnEvents.isConnected]);

  // Efecto simplificado - ya no hay sincronización de activeTab con modales
  // porque todas las pantallas son tabs independientes

  // Funciones para manejar las acciones de la pantalla de bienvenida
  const handleWelcomeContinueToApp = () => {
    // Solo esta función cierra el WelcomeScreen
    setStorageItem("app-welcome-completed", true);
    setStorageItem("user-guest-mode", true);
    setShowWelcomeScreen(false);
  };

  const handleWelcomeBuyPremium = () => {
    // Abre el enlace externo en webview
    if (window.DtOpenWebview) {
      window.DtOpenWebview.execute("https://web.jhservices.com.ar/planes");
    } else {
      // Fallback para desarrollo
      window.open("https://web.jhservices.com.ar/planes", "_blank");
    }
  };

  const handleWelcomeResellerPlans = () => {
    // Abre el enlace externo en webview
    if (window.DtOpenWebview) {
      window.DtOpenWebview.execute(
        "https://shop.jhservices.com.ar/revendedores"
      );
    } else if (window.DtStartWebViewActivity) {
      window.DtStartWebViewActivity.execute(
        "https://shop.jhservices.com.ar/revendedores"
      );
    } else {
      // Fallback para desarrollo
      window.open("https://shop.jhservices.com.ar/revendedores", "_blank");
    }
  };

  const handleModalNavigate = useCallback(
    (modal: ModalType | null) => {
      if (!modal) {
        setCurrentModal(null);
        return;
      }

      switch (modal) {
        case "serverselector":
          setCurrentModal(null);
          setShowWelcomeScreen(false);
          setActiveTab("servers");
          break;
        case "credentials":
          setCurrentModal(null);
          setShowWelcomeScreen(false);
          setActiveTab("profile");
          break;
        case "buy":
          setCurrentModal(null);
          handleOpenPricingScreen();
          break;
        default:
          setCurrentModal(modal);
          break;
      }
    },
    [handleOpenPricingScreen]
  );

  // Componente interno para manejar el auto-tutorial
  // Debe estar dentro de los providers para acceder al contexto
  const AutoTutorialHandler = ({ showWelcome }: { showWelcome: boolean }) => {
    useAutoTutorial(showWelcome);
    return null;
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ActiveConfigProvider>
          <TutorialProvider>
            <AutoTutorialHandler showWelcome={showWelcomeScreen} />
            <main
              className={`w-full min-h-screen flex flex-col relative no-select no-drag text-neutral-strong overflow-hidden ${
                showWelcomeScreen ? "bg-transparent" : "bg-screen-unified"
              }`}
              style={{ minHeight: "100vh", width: "100%" }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {(() => {
                const isTvMode =
                  typeof window !== "undefined" &&
                  (window.location.pathname.endsWith("/tv") ||
                    new URLSearchParams(window.location.search).get("tv") ===
                      "1" ||
                    getStorageItem<string>("preferred-mode") === "tv");
                if (isTvMode) {
                  // Render exclusivo para Modo TV
                  return <TvModeScreen />;
                }
                return (
                  <>
                    {/* El mapa permanece montado y sólo se oculta cuando no estamos en HOME para preservar su estado y animaciones. */}
                    {(() => {
                      const hideMapForLayout =
                        showWelcomeScreen || activeTab !== "home";
                      const disableMapInteraction =
                        hideMapForLayout || !!currentModal;
                      return (
                        <div
                          className="absolute inset-0 z-0 transition-opacity duration-250"
                          aria-hidden={disableMapInteraction}
                          style={{
                            opacity: hideMapForLayout ? 0 : 1,
                            pointerEvents: disableMapInteraction
                              ? "none"
                              : "auto",
                            visibility: hideMapForLayout ? "hidden" : "visible",
                          }}
                        >
                          <div className="relative w-full h-full">
                            <MapLatAmVPN
                              className="w-full h-full"
                              showGrid={false}
                              vpnState={vpnState}
                            />
                          </div>
                        </div>
                      );
                    })()}
                    {/* Contenido principal condicional: mostrar la pantalla activa según el tab */}
                    {!showWelcomeScreen && (
                      <>
                        {/* HOME TAB */}
                        {activeTab === "home" && (
                          <>
                            <section
                              className="flex-1 w-full h-full flex flex-col overflow-hidden px-4 py-3 relative z-[2]"
                              id="container-home"
                              style={containerStyle}
                              aria-hidden={!!currentModal}
                            >
                              <div className="flex-1 flex flex-col">
                                <Header
                                  onMenuClick={() => setActiveTab("settings")}
                                  onCredentialsClick={() => {
                                    setCurrentModal(null);
                                    setActiveTab("profile");
                                  }}
                                />
                                <div className="flex-1 flex flex-col">
                                  {connectionError && (
                                    <div className="mt-3 mx-1 animate-in slide-in-from-top-4 duration-300">
                                      <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/95 via-red-600/90 to-red-700/95 border border-red-400/50 backdrop-blur-sm shadow-2xl shadow-red-500/30">
                                        <div className="flex items-start gap-3">
                                          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg
                                              className="w-4 h-4 text-white"
                                              fill="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-2h-2v2zm0-4h2V7h-2v6z" />
                                            </svg>
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-medium mb-1">
                                              Error de Conexión
                                            </p>
                                            <p className="text-red-100 text-xs font-normal leading-relaxed">
                                              {connectionError}
                                            </p>
                                          </div>
                                          <button
                                            onClick={() =>
                                              setConnectionError(null)
                                            }
                                            className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 hover:bg-white/30 transition-colors"
                                          >
                                            <svg
                                              className="w-3 h-3 text-white"
                                              fill="none"
                                              stroke="currentColor"
                                              viewBox="0 0 24 24"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                              />
                                            </svg>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex-1 min-h-[2rem]"></div>
                                </div>
                              </div>
                            </section>

                            {/* BottomSheet sólo cuando HOME está activo */}
                            <BottomSheetServerSelector
                              onNavigate={handleModalNavigate}
                              compact
                              compactGap={12}
                            />
                          </>
                        )}

                        {/* PROFILE TAB */}
                        {activeTab === "profile" && (
                          <section
                            className="flex-1 w-full h-full flex flex-col overflow-hidden relative z-[2]"
                            id="container-profile"
                            style={containerStyle}
                            aria-hidden={!!currentModal}
                          >
                            <UserProfileScreen />
                          </section>
                        )}

                        {/* SERVERS TAB */}
                        {activeTab === "servers" && (
                          <section
                            className="flex-1 w-full h-full flex flex-col overflow-hidden relative z-[2]"
                            id="container-servers"
                            style={containerStyle}
                            aria-hidden={!!currentModal}
                          >
                            <ServerSelectorScreen />
                          </section>
                        )}

                        {/* SETTINGS TAB */}
                        {activeTab === "settings" && (
                          <section
                            className="flex-1 w-full h-full flex flex-col overflow-hidden relative z-[2]"
                            id="container-settings"
                            style={containerStyle}
                            aria-hidden={!!currentModal}
                          >
                            <SettingsScreen
                              onNavigate={(modal: string) => {
                                handleModalNavigate(modal as ModalType);
                              }}
                            />
                          </section>
                        )}

                        {/* Footer persistente (siempre) */}
                        <Footer
                          activeTab={activeTab}
                          onNavigate={handleFooterNavigation}
                          isHidden={false}
                        />
                      </>
                    )}

                    {/* Renderizado dinámico de todos los modales */}
                    {currentModal &&
                      currentModal === "buy" &&
                      // Modal "buy" abre el enlace en webview
                      (() => {
                        handleOpenPricingScreen();
                        setCurrentModal(null);
                        return null;
                      })()}

                    {currentModal &&
                      modalComponents[
                        currentModal as keyof typeof modalComponents
                      ] &&
                      (() => {
                        const ModalComponent =
                          modalComponents[
                            currentModal as keyof typeof modalComponents
                          ];

                        // Manejo especial para modales de advertencia que necesitan el tipo de notificación
                        if (
                          [
                            "missingcredentials",
                            "missingserver",
                            "missingsetup",
                          ].includes(String(currentModal))
                        ) {
                          const notification = { type: currentModal as any };
                          return (
                            <ModalComponent
                              isOpen={true}
                              onClose={() => {
                                setCurrentModal(null);
                              }}
                              onNavigate={handleModalNavigate}
                              {...{ notification }}
                            />
                          );
                        }

                        // Para todos los demás modales
                        return (
                          <ModalComponent
                            isOpen={true}
                            onClose={() => {
                              setCurrentModal(null);
                            }}
                            onNavigate={handleModalNavigate}
                          />
                        );
                      })()}

                    {/* Pantalla de bienvenida */}
                    {showWelcomeScreen && (
                      <WelcomeScreen
                        onContinue={handleWelcomeContinueToApp}
                        onBuyPremium={handleWelcomeBuyPremium}
                        onResellerPlans={handleWelcomeResellerPlans}
                      />
                    )}

                    {/* Overlay del tutorial */}
                    <TutorialOverlay />

                    {/* Indicador visual de swipe */}
                    <SwipeIndicator
                      direction={indicator.direction}
                      nextTab={indicator.nextTab}
                      isVisible={indicator.isVisible}
                    />
                  </>
                );
              })()}
            </main>
          </TutorialProvider>
        </ActiveConfigProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
