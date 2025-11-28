/**
 * @file useServerSelectorScreen.ts
 * @description Hook principal para la lógica de ServerSelectorScreen
 */

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { ConfigCategory, ConfigItem } from "../../../../types/config";
import { nativeAPI } from "../../../../utils/unifiedNativeAPI";
import { useActiveConfig } from "../../../../context/ActiveConfigContext";
import { useAndroidBackButton } from "../../../../hooks/useAndroidBackButton";
import { getStatusBarHeight, getNavigationBarHeight } from "../../../../utils/deviceUtils";
import { useTranslations } from "../../../../context/LanguageContext";
import { useNativeSelectorBridge } from "./useNativeSelectorBridge";
import { useServerConfigsLoader } from "./useServerConfigsLoader";
import { useServerSearchAndGrouping } from "./useServerSearchAndGrouping";

export const useServerSelectorScreen = () => {
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pendingConfigId, setPendingConfigId] = useState<number | null>(null);
  const [loadingCategoryId, setLoadingCategoryId] = useState<number | null>(null);

  const { activeConfig, setActiveConfigId, refreshActiveConfig } = useActiveConfig();
  const t = useTranslations();

  const [selectedCategory, setSelectedCategory] = useState<ConfigCategory | null>(null);
  const initializedRef = useRef(false);
  // Referencia para rastrear el último servidor activo conocido
  const lastActiveConfigIdRef = useRef<number | null>(null);

  const {
    useNativeSelector,
    setUseNativeSelector,
    openNativeSelector,
    toggleNativeSelector: onToggleNativeSelector,
  } = useNativeSelectorBridge({
    onError: setLoadError,
    messages: {
      missingApi: t.serverSelectorScreen.errorView.loadError,
      connectionFailed: t.serverSelectorScreen.errorView.connectionFailed,
    },
  });

  const {
    configs,
    loading,
    loadConfigs,
    handleUpdate,
  } = useServerConfigsLoader({
    useNativeSelector,
    setUseNativeSelector,
    refreshActiveConfig,
    openNativeSelector,
    setLoadError,
    messages: {
      noServersAvailable: t.serverSelectorScreen.loadingView.noServersAvailable,
      loadError: t.serverSelectorScreen.errorView.loadError,
    },
  });

  const {
    query,
    setQuery,
    groupedItems,
    filteredItems,
    expandedGroups,
    toggleGroup,
    isGroupExpanded,
  } = useServerSearchAndGrouping({ selectedCategory, t });

  // Hook para manejar el botón back de Android - simplificado para pantalla fija
  useAndroidBackButton({
    isActive: true, // Siempre activo para pantalla fija
    onBackPressed: () => {
      if (selectedCategory) {
        setSelectedCategory(null);
        setQuery('');
      }
      // No hay onClose para pantalla fija
    },
  });

  // Función para manejar selección de categoría
  const originalHandleCategorySelect = useCallback((category: ConfigCategory) => {
    setSelectedCategory(category);
    setQuery('');
  }, [setQuery]);

  // Función de selección de categoría con loading
  const handleCategorySelect = useCallback((category: ConfigCategory) => {
    if (useNativeSelector) {
      openNativeSelector();
      return;
    }

    setLoadingCategoryId(category.id);
    
    // Simular carga de datos de la categoría
    setTimeout(() => {
      originalHandleCategorySelect(category);
      setLoadingCategoryId(null);
    }, 300); // Reducir delay para mejor UX
  }, [originalHandleCategorySelect, useNativeSelector, openNativeSelector]);


  const handleConfigSelect = useCallback((config: ConfigItem) => {
    if (useNativeSelector) {
      openNativeSelector();
      return;
    }
    
    // Marcar selección en curso para feedback visual
    setPendingConfigId(config.id);

    // Usar solo el contexto, que ya invoca al nativo y refresca
    try {
      // Dar tiempo a la API nativa para procesar antes de verificar
      setTimeout(() => {
        setActiveConfigId(config.id);
      }, 100);
      
      // Confirmar que la selección se aplicó correctamente
      // Verificar con reintentos para evitar race conditions
      let attempts = 0;
      const maxAttempts = 5;
      
      const verifySelection = () => {
        attempts++;
        
        // Pequeño delay para permitir que el nativo procese
        setTimeout(() => {
          try {
            const current = nativeAPI.config.getActive();
            const currentId = String(current?.id);
            const configId = String(config.id);
            
            console.log(`📝 [SERVER_SELECTOR] Intento ${attempts}: Buscando ${configId}, Actual: ${currentId}`);
            
            if (current && currentId === configId) {
              // Selección confirmada - limpiar pending
              setPendingConfigId(null);
              console.log(`✓ [SERVER_SELECTOR] Servidor confirmado: ${config.name} (ID: ${config.id})`);
            } else if (attempts < maxAttempts) {
              // Reintentar
              console.warn(`⚠ [SERVER_SELECTOR] Intento ${attempts}/${maxAttempts} - reintentando selección...`);
              verifySelection();
            } else {
              // Falló después de reintentos - pero marcar como seleccionado de todas formas
              console.error(`✗ [SERVER_SELECTOR] No se pudo confirmar selección después de ${maxAttempts} intentos. Actual: ${currentId}`);
              setPendingConfigId(null);
              // No mostrar error, pero log para debugging
              console.warn(`⚠ [SERVER_SELECTOR] Selección completada (sin confirmación). Servidor: ${config.name}`);
            }
          } catch (error) {
            console.error("🔴 [SERVER_SELECTOR] Error verificando selección:", error);
            if (attempts < maxAttempts) {
              verifySelection();
            } else {
              setPendingConfigId(null);
              console.warn(`⚠ [SERVER_SELECTOR] Selección completada (error en verificación). Servidor: ${config.name}`);
            }
          }
        }, 100 + 80 * attempts); // Incrementar delay con cada reintento, comenzando en 100ms
      };
      
      // Esperar un poco antes de empezar a verificar (dejar que setActiveConfigId procese)
      setTimeout(verifySelection, 200);
      
    } catch (error) {
      console.error("🔴 [SERVER_SELECTOR] Error in setActiveConfigId:", error);
      setLoadError("Error al seleccionar servidor");
      setPendingConfigId(null);
      setTimeout(() => setLoadError(null), 2000);
    }
  }, [setActiveConfigId, useNativeSelector, openNativeSelector]);

  // Auto-seleccionar la categoría del servidor activo al cargar configs
  // Si no hay servidor activo, seleccionar la primera categoría
  useEffect(() => {
    if (configs.length > 0 && !initializedRef.current) {
      // Buscar la categoría que contiene el servidor activo
      const categoryWithActiveConfig = activeConfig
        ? configs.find((c) => c.items.some((it) => it.id === activeConfig.id))
        : null;
      
      // Usar la categoría activa o la primera si no hay servidor activo
      setSelectedCategory(categoryWithActiveConfig || configs[0]);
      setQuery('');
      initializedRef.current = true;
      // Guardar el ID del servidor activo actual
      lastActiveConfigIdRef.current = activeConfig?.id ?? null;
    }
  }, [configs, activeConfig, setQuery]);

  // Sincronizar categoría seleccionada cuando cambie el servidor activo externamente
  // Esto asegura que al volver a la pantalla, se muestre la categoría del servidor actual
  useEffect(() => {
    if (configs.length > 0 && activeConfig && initializedRef.current) {
      // Solo sincronizar si el servidor activo cambió desde la última vez
      if (lastActiveConfigIdRef.current !== activeConfig.id) {
        const categoryWithActiveConfig = configs.find((c) => 
          c.items.some((it) => it.id === activeConfig.id)
        );
        
        if (categoryWithActiveConfig) {
          setSelectedCategory(categoryWithActiveConfig);
          setQuery('');
        }
        // Actualizar la referencia
        lastActiveConfigIdRef.current = activeConfig.id;
      }
    }
  }, [configs, activeConfig, setQuery]);

  // Cleanup effect - ya no necesario para pantalla fija
  // Los estados se mantienen durante la sesión de la pantalla

  // Derivados para estados
  const hasConfigs = configs.length > 0;

  const activeCategory = useMemo(() => {
    if (!activeConfig) return null;
    return configs.find((c) => c.items.some((it) => it.id === activeConfig.id)) || null;
  }, [configs, activeConfig]);

  // Auto seleccionar primera categoría si el usuario comienza a escribir y no hay categoría aún
  useEffect(() => {
    if (!selectedCategory && query.trim().length > 0 && configs.length > 0) {
      setSelectedCategory(configs[0]);
      setQuery('');
    }
  }, [configs, query, selectedCategory, setQuery]);

  // Height calculations
  const statusBarHeight = getStatusBarHeight();
  const navigationBarHeight = getNavigationBarHeight();
  const scrollBottomPadding = navigationBarHeight + 16;

  // Computed values
  const headerTitle = t.serverSelectorScreen.header.categories;

  return {
    // Estado
    configs,
    loading,
    loadingCategoryId,
    pendingConfigId,
    query,
    setQuery,
    expandedGroups,
    hasConfigs,
    activeConfig,
    activeCategory,
    selectedCategory,
    setSelectedCategory,
    useNativeSelector,
    loadError,
    
    // Datos computados
    filteredItems,
    groupedItems,
    headerTitle,
    statusBarHeight,
    navigationBarHeight,
    scrollBottomPadding,
    
    // Funciones
    handleConfigSelect,
    handleUpdate,
    handleCategorySelect,
    toggleGroup,
    isGroupExpanded,
    loadConfigs,
    onToggleNativeSelector,
    openNativeSelector,
    refreshActiveConfig
  };
};
