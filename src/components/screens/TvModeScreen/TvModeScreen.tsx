import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useUnifiedVpn } from '../../../hooks/useUnifiedVpn';
import { useActiveConfig } from '../../../context/ActiveConfigContext';


import { ServerSelectorScreen } from '../ServerSelectorScreen/ServerSelectorScreen';
import { useServerSelectorScreen } from '../ServerSelectorScreen/hooks/useServerSelectorScreen';
import { ServerView } from '../ServerSelectorScreen/components/ServerView';
import { useTranslations } from '../../../hooks/useTranslations';
import { nativeAPI } from '../../../utils';
import { useSafeArea } from '../../../utils/deviceUtils';
import { useResponsive } from '../../../hooks/useResponsive';
import { useResponsiveUI } from '../../../responsive/unifiedResponsive';
import { setStorageItem } from '../../../utils/storageUtils';
import { TvCredentialsPanel } from './components/TvCredentialsPanel';
import { ResponsiveConnectionButton } from './components/ResponsiveConnectionButton';
import { ResponsiveLogsButton } from './components/ResponsiveLogsButton';
import { StepSection } from './components/StepSection';
import { TvModeHeader } from './components/TvModeHeader';
import { TvHorizontalLayout } from './components/TvHorizontalLayout';
import { useVirtualCursor } from '../welcome/hooks/useVirtualCursor';
import { VirtualCursorOverlay } from '../welcome/components/VirtualCursorOverlay';

/**
 * TvModeScreen refactorizada usando componentes extraídos y cursor virtual
 */

export const TvModeScreen: React.FC = () => {
  const { t } = useTranslations();
  const vpn = useUnifiedVpn();
  const { activeConfig } = useActiveConfig();
  const responsive = useResponsive();
  const { spacePx } = useResponsiveUI();
  const { statusBarHeight, navigationBarHeight } = useSafeArea();

  const [formError, setFormError] = useState<string | null>(null);
  const [showServerSelector, setShowServerSelector] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  // Resaltados de pasos cuando faltan precondiciones
  const [highlightStep1, setHighlightStep1] = useState(false); // Credenciales
  const [highlightStep2, setHighlightStep2] = useState(false); // Servidor

  const pulseHighlight = (step: 1 | 2) => {
    if (step === 1) {
      setHighlightStep1(true);
      setTimeout(() => setHighlightStep1(false), 1800);
    } else {
      setHighlightStep2(true);
      setTimeout(() => setHighlightStep2(false), 1800);
    }
  };

  // Hook de lista de servidores para la tercera columna (embebido)
  const {
    configs,
    loading,
    loadError,
    query,
    setQuery,
    activeCategory,
    selectedCategory,
    setSelectedCategory,
    groupedItems,
    activeConfig: ssActiveConfig,
    pendingConfigId,
    toggleGroup,
    isGroupExpanded,
    handleConfigSelect,
    refreshActiveConfig,
  } = useServerSelectorScreen();

  // Seleccionar por defecto la categoría del servidor activo o la primera disponible
  useEffect(() => {
    if (!selectedCategory) {
      if (activeCategory) {
        setSelectedCategory(activeCategory);
      } else if (configs && configs.length > 0) {
        setSelectedCategory(configs[0]);
      }
    }
  }, [selectedCategory, activeCategory, configs, setSelectedCategory]);

  // Refrescar cuando se limpia pendingConfigId (selección confirmada)
  useEffect(() => {
    if (pendingConfigId === null && selectedCategory) {
      // Dar un pequeño delay para que el nativo procese
      const timer = setTimeout(() => {
        refreshActiveConfig?.();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pendingConfigId, selectedCategory, refreshActiveConfig]);

  // Validar precondiciones antes de conectar (reutilizado del BottomSheet)
  const validatePreconditions = useCallback((): {
    ok: boolean;
    type?: 'missingserver' | 'missingcredentials' | 'missingsetup';
    message?: string;
  } => {
    const hasServer = Boolean(nativeAPI.config.getActive());
    const needsUsername = nativeAPI.auth.shouldShowInput('username');
    const needsPassword = nativeAPI.auth.shouldShowInput('password');
    const username = nativeAPI.auth.getUsername()?.trim();
    const password = nativeAPI.auth.getPassword()?.trim();

    let missingCreds = false;
    const missingParts: string[] = [];
    if (needsUsername && !username) { missingCreds = true; missingParts.push(t.credentialsPanel.usernameLabel); }
    if (needsPassword && !password) { missingCreds = true; missingParts.push(t.credentialsPanel.passwordLabel); }

    if (hasServer && !missingCreds) return { ok: true };
  if (!hasServer && missingCreds) return { ok: false, type: 'missingsetup', message: 'Configuración incompleta' };
    if (!hasServer) return { ok: false, type: 'missingserver', message: 'No hay ninguna configuración seleccionada' };
    return { ok: false, type: 'missingcredentials', message: 'Faltan credenciales' };
  }, [t]);

  const handleConnection = useCallback(async () => {
    try {
      setFormError(null);
      if (vpn.state === 'CONNECTED') return vpn.disconnect();

      if ([
        'DISCONNECTED',
        'AUTH_FAILED',
        'NO_NETWORK',
      ].includes(vpn.state)) {
        const validation = validatePreconditions();
        if (!validation.ok) {
          setFormError(validation.message || t.tvMode?.validation?.incomplete || 'Configuración incompleta');
          // Resaltar pasos según lo que falte (missingsetup = ambos)
          if (validation.type === 'missingcredentials' || validation.type === 'missingsetup') pulseHighlight(1);
          if (validation.type === 'missingserver' || validation.type === 'missingsetup') pulseHighlight(2);
          // Ya no abrimos automáticamente el selector: guiamos con highlight
          return;
        }
        return vpn.connect();
      }

      // Estados intermedios -> cancelar
      if (['CONNECTING', 'AUTH', 'STOPPING'].includes(vpn.state)) {
        return vpn.disconnect();
      }
    } catch (e) {
      setFormError(t.tvMode?.validation?.processError || 'Error al procesar la conexión');
    }
  }, [vpn, validatePreconditions]);

  // Cuando cambie el servidor activo desde el selector
  // (Reservado) Helper para aplicar selección de servidor si se expone un callback específico en el futuro

  useEffect(() => {
    if (vpn.state === 'CONNECTED') setFormError(null);
  }, [vpn.state]);

  // i18n title

  // Salir de Modo TV → volver a modo móvil
  const handleExitTvMode = useCallback(() => {
    try {
      setStorageItem('preferred-mode', 'mobile');
      // Limpiar /tv y ?tv=1 de la URL sin disparar chooser del sistema
      if (typeof window !== 'undefined' && window.history && window.location) {
        const url = new URL(window.location.href);
        // Quitar query ?tv=1 si existe
        url.searchParams.delete('tv');
        // Quitar /tv al final del path si existe
        if (url.pathname.endsWith('/tv')) {
          url.pathname = url.pathname.replace(/\/tv$/, '/');
        }
        // Normalizar doble barra
        url.pathname = url.pathname.replace(/\/{2,}/g, '/');
        window.history.replaceState({}, '', url.toString());
      }
      // Notificar cambio sin recargar
      window.dispatchEvent(new Event('preferred-mode-change'));
    } catch (e) {
      // noop
    }
  }, []);

  // Cursor virtual (reutilizamos el hook del welcome). Posición inicial centro.
  const cursor = useVirtualCursor({ initial: { x: typeof window !== 'undefined' ? window.innerWidth/2 : 300, y: 200 } });

  // Simular hover mientras se mueve
  useEffect(() => {
    if (!cursor.active) return;
    const { x, y } = cursor.position;
    const el = document.elementFromPoint(x, y);
    if (el) {
      el.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, cancelable: true, clientX: x, clientY: y }));
    }
  }, [cursor.active, cursor.position]);

  // Click simulado
  useEffect(() => {
    const handler = () => {
      if (!cursor.active) return;
      const { x, y } = cursor.position;
      const el = document.elementFromPoint(x, y) as HTMLElement | null;
      if (!el) return;
      if (['BUTTON','A','INPUT','SELECT','TEXTAREA'].includes(el.tagName)) {
        try { el.focus({ preventScroll: true }); } catch {}
      }
      ['mousedown','mouseup','click'].forEach(type => {
        el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, button: 0 }));
      });
    };
    window.addEventListener('virtual-cursor-click', handler);
    return () => window.removeEventListener('virtual-cursor-click', handler);
  }, [cursor]);

  // Sistema responsivo completo para TV adaptable
  // Nuevo layout: Servidor prominente a la izquierda, otras 2 columnas apiladas a la derecha
  const responsiveLayout = useMemo(() => {
    const w = responsive.width;
    const h = responsive.height;
    const isVeryWide = w >= 1400;
    
    // Detectar orientación y tipo de dispositivo
    const isTablet = w >= 768 && w <= 1024;
    const isMobile = w < 768;
    const isTV = w >= 1024;
    // HD normal (1366x768) y superior es considerado TV moderno
    const isLegacyTv = isTV && (w < 1280 || (h < 720 && w < 1366));
    
    let layout = {
      columns: '1fr',
      rightColumns: '1fr',
      direction: 'vertical' as 'vertical' | 'horizontal',
      spacing: 4,
      padding: 4,
      headerSize: 'small' as 'small' | 'medium' | 'large',
      buttonSize: 'medium' as 'small' | 'medium' | 'large',
      fontSize: 'base' as 'small' | 'base' | 'large',
      stacked: true,
      compact: false,
      serverWidth: '1fr',
      legacy: false,
    };
    
    if (responsive.isPortrait) {
      // Modo vertical - siempre apilado
      if (isMobile) {
        layout = {
          columns: '1fr',
          rightColumns: '1fr',
          direction: 'vertical',
          spacing: 3,
          padding: 4,
          headerSize: 'small',
          buttonSize: 'small',
          fontSize: 'small',
          stacked: true,
          compact: false,
          serverWidth: '1fr',
          legacy: false,
        };
      } else if (isTablet) {
        layout = {
          columns: '1fr',
          rightColumns: '1fr',
          direction: 'vertical',
          spacing: 4,
          padding: 6,
          headerSize: 'medium',
          buttonSize: 'medium',
          fontSize: 'base',
          stacked: true,
          compact: false,
          serverWidth: '1fr',
          legacy: false,
        };
      }
    } else {
      // Modo horizontal
      if (isMobile) {
        // Móvil horizontal - layout específico muy compacto
        if (w < 600) {
          // Móvil muy pequeño horizontal - stacked pero más compacto
          layout = {
            columns: '1fr',
            rightColumns: '1fr',
            direction: 'vertical',
            spacing: 2,
            padding: 2,
            headerSize: 'small',
            buttonSize: 'small',
            fontSize: 'small',
            stacked: true,
            compact: true,
            serverWidth: '1fr',
            legacy: false,
          };
        } else {
          // Móvil horizontal normal - servidor + otros apilados a la derecha
          layout = {
            columns: '1.2fr 1fr',
            rightColumns: '1fr',
            direction: 'horizontal', 
            spacing: 2,
            padding: 3,
            headerSize: 'small',
            buttonSize: 'small',
            fontSize: 'small',
            stacked: false,
            compact: true,
            serverWidth: '1.2fr',
            legacy: false,
          };
        }
      } else if (isTablet) {
        // Tablet horizontal - Servidor prominente (izq), credenciales y conexión apiladas (der)
        layout = {
          columns: '1.5fr 1fr',
          rightColumns: '1fr',
          direction: 'horizontal',
          spacing: 4,
          padding: 6,
          headerSize: 'medium',
          buttonSize: 'medium',
          fontSize: 'base',
          stacked: false,
          compact: false,
          serverWidth: '1.5fr',
          legacy: false,
        };
      } else if (isTV) {
        // TV - Todo muy compacto para no desperdiciar espacio
        const serverColWidth = isVeryWide ? '2fr' : '1.7fr';
        layout = {
          columns: `${serverColWidth} 1fr`,
          rightColumns: '1fr',
          direction: 'horizontal',
          spacing: 3,
          padding: 3,
          headerSize: 'small',
          buttonSize: 'medium',
          fontSize: 'small',
          stacked: false,
          compact: true,
          serverWidth: serverColWidth,
          legacy: false,
        };

        // HD normal (1366x768) - aún más compacto
        if (w >= 1280 && w <= 1400 && h <= 800) {
          layout = {
            ...layout,
            spacing: 2.5,
            padding: 2.5,
            headerSize: 'small',
            buttonSize: 'small',
            fontSize: 'small',
            compact: true,
            legacy: false,
          };
        }

        if (isLegacyTv) {
          layout = {
            ...layout,
            spacing: 2,
            padding: 2,
            headerSize: 'small',
            buttonSize: 'small',
            fontSize: 'small',
            compact: true,
            legacy: true,
          };
        }
      }
    }
    
    return layout;
  }, [responsive.width, responsive.height, responsive.isPortrait]);

  const contentJustifyClass = useMemo(() => {
    return responsiveLayout.buttonSize === 'large' ? 'justify-center' : 'justify-start';
  }, [responsiveLayout]);

  const showServerDescription = false;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulse-server {
            0%, 100% { 
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4), 0 4px 12px rgba(0,0,0,0.12);
            }
            50% { 
              box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0,0,0,0.12);
            }
          }
          
          .scrollbar-hidden::-webkit-scrollbar {
            display: none;
          }
          
          /* COMPACTACIÓN AGRESIVA PARA TV */
          .server-list-compact {
            font-size: 0.75rem !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 0.25rem !important;
            padding-right: 1rem !important;
          }
          
          .server-list-compact div {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .server-list-compact > div {
            gap: 0.25rem !important;
          }
          
          .server-list-compact input {
            height: 1.75rem !important;
            padding: 0.25rem 0.5rem !important;
            font-size: 0.75rem !important;
            margin-bottom: 0.5rem !important;
            margin-right: 0.5rem !important;
          }
          
          .server-list-compact [role="button"],
          .server-list-compact button {
            padding: 0.25rem 0.5rem !important;
            font-size: 0.75rem !important;
            height: auto !important;
            min-height: 1.75rem !important;
            margin: 0 !important;
          }
          
          /* Reducir padding de cards de grupo */
          .server-list-compact [style*="backgroundColor"] {
            padding: 0.5rem !important;
            margin-right: 0.5rem !important;
          }
          
          .server-list-compact p {
            margin: 0 !important;
            padding: 0 !important;
            font-size: 0.75rem !important;
            line-height: 1rem !important;
          }
          
          .server-list-compact span {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Items de servidor - compactos */
          .server-list-compact [data-role="server-item"] {
            padding: 0.375rem !important;
            margin: 0.125rem 0.25rem !important;
            gap: 0.5rem !important;
          }
          
          /* Gap entre grupos */
          .server-list-compact > div > div {
            gap: 0.125rem !important;
          }
          
          /* Eliminar sombras en tarjetas de grupo en TV */
          .server-list-compact > div {
            box-shadow: none !important;
          }
          
          /* Hacer la columna del servidor más prominente */
          .tv-layout-horizontal > div:first-child {
            display: flex;
            flex-direction: column;
            min-height: 100%;
          }
          
          /* Asegurar que el contenedor derecho mantenga las secciones apiladas */
          .tv-layout-horizontal > div:last-child {
            display: flex;
            flex-direction: column;
            overflow-y: auto;
          }
        `
      }} />
      <section className="w-full h-screen flex flex-col bg-screen-unified text-neutral-strong">
      {/* Header mejorado */}
      <TvModeHeader 
        activeConfigName={activeConfig?.name} 
        onHowItWorks={() => setShowHowItWorks(true)}
        onExitTvMode={handleExitTvMode}
        isCompact={responsiveLayout.legacy}
      />

      {/* Cuerpo responsivo: se adapta automáticamente según el dispositivo */}
      <div
        className={`flex-1 min-h-0 ${responsiveLayout.stacked ? 'flex flex-col' : 'grid tv-layout-horizontal'}`}
        style={{
          ...(responsiveLayout.stacked ? {} : { gridTemplateColumns: responsiveLayout.columns }),
          gap: spacePx(responsiveLayout.spacing),
          padding: spacePx(responsiveLayout.padding),
          // Respetar safe areas laterales y fondo
          paddingLeft: `calc(${spacePx(responsiveLayout.padding)}px + env(safe-area-inset-left, 0px))`,
          paddingRight: `calc(${spacePx(responsiveLayout.padding)}px + ${responsive.isLandscape ? navigationBarHeight : 0}px + env(safe-area-inset-right, 0px))`,
          // En landscape, la barra de navegación suele estar a la derecha (no abajo): no sumar navigationBarHeight al bottom
          paddingBottom: `calc(${spacePx(responsiveLayout.padding)}px + ${responsive.isPortrait ? navigationBarHeight : 0}px + env(safe-area-inset-bottom, 0px))`,
        }}
      >
        {/* Nuevo layout: Servidor prominente a la izquierda */}
        {!responsiveLayout.stacked ? (
          <TvHorizontalLayout
            spacePx={spacePx}
            responsiveLayout={responsiveLayout}
            highlightStep1={highlightStep1}
            highlightStep2={highlightStep2}
            loading={loading}
            loadError={loadError}
            selectedCategory={selectedCategory}
            contentJustifyClass={contentJustifyClass}
            query={query}
            setQuery={setQuery}
            groupedItems={groupedItems}
            ssActiveConfig={ssActiveConfig}
            pendingConfigId={pendingConfigId}
            toggleGroup={toggleGroup}
            isGroupExpanded={isGroupExpanded}
            handleConfigSelect={handleConfigSelect}
            activeConfig={activeConfig}
            formError={formError}
            vpn={vpn}
            handleConnection={handleConnection}
            showServerDescription={showServerDescription}
          />
        ) : (
          <>
            {/* Modo vertical - apilado en el orden original */}
            {/* PASO 1 */}
            <StepSection
              title={t.tvMode?.steps?.credentials || 'PONER CREDENCIALES'}
              headerSize={responsiveLayout.headerSize}
              compact={responsiveLayout.compact}
              padding={spacePx(responsiveLayout.padding)}
              scrollable={false}
              className={`${responsiveLayout.stacked ? 'mb-4' : ''} ${highlightStep1 ? 'ring-2 ring-emerald-400/70 shadow-[0_0_0_1px_rgba(72,231,164,0.45)] animate-pulse' : ''}`}
            >
              <TvCredentialsPanel compact={responsiveLayout.compact} />
            </StepSection>

            {/* PASO 2 */}
            <StepSection
              title={t.tvMode?.steps?.selectServer || 'ELEGIR SERVIDOR'}
              headerSize={responsiveLayout.headerSize}
              compact={responsiveLayout.compact}
              padding={spacePx(responsiveLayout.padding)}
              className={`${responsiveLayout.stacked ? 'mb-4' : ''} ${highlightStep2 ? 'ring-2 ring-emerald-400/70 shadow-[0_0_0_1px_rgba(72,231,164,0.45)] animate-pulse' : ''}`}
              showScrollButtons={true}
            >
              <div className={`${responsiveLayout.compact ? 'text-xs' : 'text-sm'} scrollbar-hidden`}>
                {loading ? (
                  <p className={`opacity-70 text-center ${responsiveLayout.compact ? 'text-xs' : responsiveLayout.fontSize === 'small' ? 'text-sm' : responsiveLayout.fontSize === 'large' ? 'text-lg' : 'text-base'}`}>{(t.common?.loading || 'Cargando') + ' servidores...'}</p>
                ) : loadError ? (
                  <p className={`text-red-500 text-center ${responsiveLayout.compact ? 'text-xs' : responsiveLayout.fontSize === 'small' ? 'text-sm' : responsiveLayout.fontSize === 'large' ? 'text-lg' : 'text-base'}`}>{loadError}</p>
                ) : !selectedCategory ? (
                  <p className={`opacity-70 text-center ${responsiveLayout.compact ? 'text-xs' : responsiveLayout.fontSize === 'small' ? 'text-sm' : responsiveLayout.fontSize === 'large' ? 'text-lg' : 'text-base'}`}>{t.tvMode?.emptyCategory || 'Selecciona una categoría para ver servidores'}</p>
                ) : (
                  <div className={responsiveLayout.compact ? 'server-list-compact' : ''}>
                    <ServerView
                      query={query}
                      setQuery={setQuery}
                      groupedItems={groupedItems}
                      activeConfig={ssActiveConfig}
                      pendingConfigId={pendingConfigId}
                      toggleGroup={toggleGroup}
                      isGroupExpanded={isGroupExpanded}
                      handleConfigSelect={handleConfigSelect}
                    />
                  </div>
                )}
              </div>
            </StepSection>

            {/* PASO 3 */}
            <StepSection
              title={t.tvMode?.steps?.connection || 'CONEXIÓN'}
              headerSize={responsiveLayout.headerSize}
              compact={responsiveLayout.compact}
              padding={spacePx(responsiveLayout.padding)}
              scrollable={false}
              className={responsiveLayout.stacked ? 'mb-4' : ''}
            >
              <div className={`flex flex-col items-center ${contentJustifyClass} h-full`}>
                {showServerDescription && activeConfig?.description && (
                  <p className={`text-neutral-text max-w-sm leading-relaxed text-center ${responsiveLayout.fontSize === 'small' ? 'text-xs' : responsiveLayout.fontSize === 'large' ? 'text-base' : 'text-sm'}`} style={{ marginBottom: spacePx(responsiveLayout.spacing) }}>
                    {activeConfig.description}
                  </p>
                )}
                {formError && (
                  <div className={`rounded-xl bg-red-600/90 text-white font-medium max-w-sm text-center ${responsiveLayout.fontSize === 'small' ? 'text-sm' : 'text-base'}`}
                       style={{ marginBottom: spacePx(responsiveLayout.spacing * 2), padding: spacePx(responsiveLayout.spacing) }}>
                    {formError}
                  </div>
                )}
                <div className="flex flex-col items-center justify-center" style={{ gap: spacePx(responsiveLayout.spacing) }}>
                  <ResponsiveConnectionButton vpn={vpn} onConnection={handleConnection} size={responsiveLayout.buttonSize} compact={responsiveLayout.compact} />
                  <ResponsiveLogsButton size={responsiveLayout.buttonSize} compact={responsiveLayout.compact} />
                </div>
              </div>
            </StepSection>
          </>
        )}
      </div>

      {/* Overlay del selector de servidores para TV */}
      {showServerSelector && (
        <div className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm">
          <div className="absolute inset-0 flex flex-col">
            {/* Safe area top spacer for overlay */}
            <div style={{ height: statusBarHeight }} />
            <div
              className="p-4 flex items-center justify-between bg-surface/80 border-b border-surface-border"
              style={{
                // Safe areas horizontales para header del overlay
                paddingLeft: `calc(${spacePx(4)}px + env(safe-area-inset-left, 0px))`,
                paddingRight: `calc(${spacePx(4)}px + ${responsive.isLandscape ? navigationBarHeight : 0}px + env(safe-area-inset-right, 0px))`,
              }}
            >
              <h3 className="text-lg font-semibold">{t.serverSelectorScreen.header.selectServer}</h3>
              <div className="space-x-2">
                <button
                  className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white text-sm"
                  onClick={() => setShowServerSelector(false)}
                >
                  {t.common?.close || 'Cerrar'}
                </button>
              </div>
            </div>
            <div
              className="flex-1 bg-screen-unified overflow-auto"
              style={{
                // Safe areas for overlay content
                paddingLeft: 'env(safe-area-inset-left, 0px)',
                paddingRight: `calc(${responsive.isLandscape ? navigationBarHeight : 0}px + env(safe-area-inset-right, 0px))`,
                // En landscape, evitar reservar espacio inferior por la barra (que está a la derecha)
                paddingBottom: `calc(${responsive.isPortrait ? navigationBarHeight : 0}px + env(safe-area-inset-bottom, 0px))`,
              }}
            >
              {/* Reutilizamos la pantalla ya existente a pantalla completa */}
              <ServerSelectorScreen
                // Notas: ServerSelectorScreen maneja su propio estado interno y lectura de configs.
                // El usuario puede seleccionar y volver a esta pantalla con el botón Cerrar.
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal "¿Cómo Funciona?" */}
              {showHowItWorks && (
        <div className="fixed inset-0 z-[1100] bg-black/90 flex items-center justify-center p-8">
          <div className="bg-surface rounded-2xl border border-surface-border max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div 
              className="flex-1 overflow-y-auto scrollbar-hidden" 
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none'
              }}
            >
              {/* Header del modal */}
              <div className="flex items-center justify-between p-6 border-b border-surface-border">
                <h2 className="text-2xl font-bold text-neutral-strong">{t.tvMode?.howItWorksModal?.title || '¿Cómo Funciona?'}</h2>
                <button
                  onClick={() => setShowHowItWorks(false)}
                  className="w-8 h-8 rounded-lg bg-slate-600 hover:bg-slate-500 text-white flex items-center justify-center"
                  title="Cerrar"
                >
                  ×
                </button>
              </div>

              {/* Contenido del modal */}
              <div className="p-6 space-y-6">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-semibold text-brand mb-3">{t.tvMode?.howItWorksModal?.introTitle || '¡Es muy fácil usar JJSecure en tu TV!'}</h3>
                  <p className="text-neutral-text text-lg">{t.tvMode?.howItWorksModal?.introSubtitle || 'Sigue estos simples pasos:'}</p>
                </div>

                {/* Pasos */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-600/10 border border-blue-600/30">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">{t.tvMode?.howItWorksModal?.steps?.install?.title || 'Instala la app en tu TV'}</h4>
                      <p className="text-white/80">{t.tvMode?.howItWorksModal?.steps?.install?.desc || 'Descarga e instala JJSecure en tu Smart TV desde la tienda de aplicaciones.'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-green-600/10 border border-green-600/30">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white font-bold flex items-center justify-center text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">{t.tvMode?.howItWorksModal?.steps?.wifi?.title || 'Conecta WiFi desde tu móvil'}</h4>
                      <p className="text-white/80">{t.tvMode?.howItWorksModal?.steps?.wifi?.desc || 'Usa tu móvil con compañía Personal (sin saldo necesario) para compartir internet con tu TV vía WiFi.'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-purple-600/10 border border-purple-600/30">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">{t.tvMode?.howItWorksModal?.steps?.follow?.title || 'Sigue los pasos aquí indicados'}</h4>
                      <p className="text-white/80">{t.tvMode?.howItWorksModal?.steps?.follow?.desc || 'Completa los 3 pasos: credenciales, elige servidor y conecta.'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-orange-600/10 border border-orange-600/30">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center text-sm">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">{t.tvMode?.howItWorksModal?.steps?.enjoy?.title || '¡Disfruta navegando!'}</h4>
                      <p className="text-white/80">{t.tvMode?.howItWorksModal?.steps?.enjoy?.desc || 'Una vez conectado, podrás navegar libremente en tu Smart TV con total privacidad.'}</p>
                    </div>
                  </div>
                </div>

                {/* Nota adicional */}
                <div className="mt-8 p-4 rounded-xl bg-yellow-600/10 border border-yellow-600/30">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-6 rounded-full bg-yellow-600 text-white flex items-center justify-center text-xs font-bold">💡</div>
                    <h4 className="font-semibold text-white">{t.tvMode?.howItWorksModal?.tipLabel || 'Consejo'}</h4>
                  </div>
                  <p className="text-white/80 text-sm">
                    {t.tvMode?.howItWorksModal?.tipText || 'No necesitas saldo en tu móvil Personal. La conexión funciona aprovechando la configuración especial de la compañía.'}
                  </p>
                </div>
              </div>

              {/* Footer del modal */}
              <div className="p-6 border-t border-surface-border text-center">
                <button
                  onClick={() => setShowHowItWorks(false)}
                  className="px-6 py-3 rounded-xl bg-brand hover:bg-primary-700 text-white font-semibold"
                >
                  {t.tvMode?.howItWorksModal?.confirmButton || '¡Entendido, empezar!'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Overlay de cursor virtual */}
      <VirtualCursorOverlay cursor={cursor} />
    </section>
    </>
  );
};

export default TvModeScreen;
