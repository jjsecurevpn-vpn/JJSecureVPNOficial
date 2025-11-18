/**
 * @file useServerSelectorScreen.ts
 * @description Hook principal para la lógica de ServerSelectorScreen
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { ConfigCategory, ConfigItem } from "../../../../types/config";
import { checkForUpdates } from "../../../../utils/appFunctions";
import { nativeAPI } from "../../../../utils/unifiedNativeAPI";
import { useActiveConfig } from "../../../../context/ActiveConfigContext";
import { useAndroidBackButton } from "../../../../hooks/useAndroidBackButton";
import { getStatusBarHeight, getNavigationBarHeight } from "../../../../utils/deviceUtils";
import {
  filterByQuery,
  filterCategoriesWithItems
} from "../../../../utils/serverUtils";
import {
  groupItemsByCategory,
  extractPremiumNumber,
  Group,
  getSubcategorySpecs
} from "../../../../utils/serverGrouping";
import { useTranslations } from "../../../../context/LanguageContext";
import { getCategoryType, getCategoryTypeStyles, getCleanCategoryName } from "../utils/categoryUtils";

export const useServerSelectorScreen = () => {
  const [configs, setConfigs] = useState<ConfigCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingConfigId, setPendingConfigId] = useState<number | null>(null);
  const [loadingCategoryId, setLoadingCategoryId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [, setDebouncedQuery] = useState(query);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [useNativeSelector, setUseNativeSelector] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const { activeConfig, setActiveConfigId, refreshActiveConfig } = useActiveConfig();
  const t = useTranslations();
  
  // Estado local para lógica de modal (reemplaza useServerSelectorModal)
  const [selectedCategory, setSelectedCategory] = useState<ConfigCategory | null>(null);

  // Hook para manejar el botón back de Android - simplificado para pantalla fija
  useAndroidBackButton({
    isActive: true, // Siempre activo para pantalla fija
    onBackPressed: () => {
      if (selectedCategory) {
        setSelectedCategory(null);
      }
      // No hay onClose para pantalla fija
    },
  });

  // Función para manejar selección de categoría
  const originalHandleCategorySelect = useCallback((category: ConfigCategory) => {
    setSelectedCategory(category);
  }, []);

  // Función para abrir el selector nativo de DTunnel
  const openNativeSelector = useCallback(() => {
    try {
      if (window?.DtExecuteDialogConfig?.execute) {
        window.DtExecuteDialogConfig.execute();
        // Ya no se cierra el modal - pantalla fija
      } else {
        console.warn("🟡 [SERVER_SELECTOR] API nativa no disponible");
        setLoadError(t.serverSelectorScreen.errorView.loadError);
      }
    } catch (error) {
      console.error("🔴 [SERVER_SELECTOR] Error al abrir selector nativo:", error);
      setLoadError(t.serverSelectorScreen.errorView.connectionFailed);
    }
  }, []);

  // Toggle entre selector personalizado y nativo
  const onToggleNativeSelector = useCallback(() => {
    if (useNativeSelector) {
      // Cambiar a personalizado
      setUseNativeSelector(false);
      loadConfigs();
    } else {
      // Cambiar a nativo
      setUseNativeSelector(true);
      openNativeSelector();
    }
  }, [useNativeSelector, openNativeSelector]);

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

  // Debounce query to avoid filtering on every keystroke
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (!useNativeSelector) { // Siempre cargar para pantalla fija
      loadConfigs();
    }
  }, [useNativeSelector]);

  const loadConfigs = useCallback(() => {
    if (useNativeSelector) return;
    
    setLoading(true);
    setLoadError(null);
    
    try {
      // Obtener configs si la API está disponible; si no, continuar con array vacío.
      let allConfigs: ConfigCategory[] = [];
      if (window?.DtGetConfigs?.execute) {
        try {
          allConfigs = nativeAPI.config.getAll() || [];
        } catch (inner) {
          console.warn('[SERVER_SELECTOR] Error leyendo configs nativas, se usarán mocks si procede:', inner);
          allConfigs = [];
        }
      } else {
        console.warn('[SERVER_SELECTOR] API nativa DtGetConfigs ausente - se evaluará uso de mocks');
      }

      const urlParams = (typeof window !== 'undefined') ? new URLSearchParams(window.location.search) : null;
      const forceMock = urlParams?.get('mockServers') === '1';

      let finalConfigs = allConfigs;
      const shouldMock = forceMock || !allConfigs || allConfigs.length === 0;

      if (shouldMock) {
        const mockCategories: ConfigCategory[] = [
          {
            id: 90001,
            name: 'MOCK PREMIUM',
            sorter: 1,
            color: '#4ade80',
            items: Array.from({ length: 6 }).map((_, i) => ({
              id: 91000 + i,
              name: `Premium #${i + 1}`,
              description: 'Servidor mock premium para pruebas de navegación con control remoto',
              mode: i % 2 === 0 ? 'SSH_PROXY' : 'V2RAY',
              sorter: i + 1,
              icon: 'https://via.placeholder.com/40x40.png?text=P',
              auth: i % 2 === 0 ? {} : { v2ray_uuid: '00000000-0000-0000-0000-000000000000' }
            }))
          },
          {
            id: 90004,
            name: '[GRATUITO] MOCK FREE',
            sorter: 1.5,
            color: '#00b96b',
            items: Array.from({ length: 4 }).map((_, i) => ({
              id: 91500 + i,
              name: `Free SSH ${i + 1} [AR]`,
              description: 'Servidor gratuito público (mock)',
              mode: 'SSH_PROXY',
              sorter: i + 1,
              icon: 'https://via.placeholder.com/40x40.png?text=F'
            }))
          },
          {
            id: 90002,
            name: 'MOCK HYSTERIA',
            sorter: 2,
            color: '#f59e0b',
            items: Array.from({ length: 4 }).map((_, i) => ({
              id: 92000 + i,
              name: `UDP HYSTERIA ${i + 1}`,
              description: 'Mock hysteria para test de agrupación',
              mode: 'HYSTERIA',
              sorter: i + 1,
              icon: 'https://via.placeholder.com/40x40.png?text=H'
            }))
          },
          {
            id: 90003,
            name: 'OTROS MOCK',
            sorter: 3,
            color: '#6366f1',
            items: [
              {
                id: 93001,
                name: 'VPN MIX #1',
                description: 'Servidor mixto para pruebas',
                mode: 'SSH_PROXY',
                sorter: 1,
                icon: 'https://via.placeholder.com/40x40.png?text=M'
              },
              {
                id: 93002,
                name: 'Premium DNS #2',
                description: 'DNS sin anuncios - mock',
                mode: 'SSH_PROXY',
                sorter: 2,
                icon: 'https://via.placeholder.com/40x40.png?text=D'
              }
            ]
          }
        ];
        finalConfigs = mockCategories;
        console.warn('[MOCK] Inyectando servidores mock para pruebas de navegación (motivo:', forceMock ? 'forceMock' : 'sin-configs o API ausente', ')');
      }

      if (!finalConfigs || finalConfigs.length === 0) {
        throw new Error(t.serverSelectorScreen.loadingView.noServersAvailable);
      }

      setConfigs(finalConfigs);
      refreshActiveConfig();
      setLoading(false);

    } catch (error) {
      console.error('🔴 [SERVER_SELECTOR] Error al cargar configuraciones:', error);
      setLoadError(error instanceof Error ? error.message : t.serverSelectorScreen.errorView.loadError);
      
      // Fallback automático al selector nativo si hay errores críticos
      setTimeout(() => {
        setLoading(false);
        if (error instanceof Error && error.message.includes("API") && !useNativeSelector) {
          console.warn("🟡 [SERVER_SELECTOR] Fallback automático al selector nativo");
          setUseNativeSelector(true);
          openNativeSelector();
        }
      }, 1000);
    }
  }, [useNativeSelector, refreshActiveConfig, openNativeSelector]);

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
              setSelectedCategory(null);
              console.log(`✓ [SERVER_SELECTOR] Servidor confirmado: ${config.name} (ID: ${config.id})`);
            } else if (attempts < maxAttempts) {
              // Reintentar
              console.warn(`⚠ [SERVER_SELECTOR] Intento ${attempts}/${maxAttempts} - reintentando selección...`);
              verifySelection();
            } else {
              // Falló después de reintentos - pero marcar como seleccionado de todas formas
              console.error(`✗ [SERVER_SELECTOR] No se pudo confirmar selección después de ${maxAttempts} intentos. Actual: ${currentId}`);
              setPendingConfigId(null);
              setSelectedCategory(null);
              // No mostrar error, pero log para debugging
              console.warn(`⚠ [SERVER_SELECTOR] Selección completada (sin confirmación). Servidor: ${config.name}`);
            }
          } catch (error) {
            console.error("🔴 [SERVER_SELECTOR] Error verificando selección:", error);
            if (attempts < maxAttempts) {
              verifySelection();
            } else {
              setPendingConfigId(null);
              setSelectedCategory(null);
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

  const handleUpdate = useCallback(() => {
    if (useNativeSelector) {
      openNativeSelector();
      return;
    }

    setLoading(true);
    setLoadError(null);
    try {
      checkForUpdates();
    } catch (error) {
      console.error("🔴 [SERVER_SELECTOR] Error al actualizar:", error);
      setLoadError(t.serverSelectorScreen.errorView.loadError);
    } finally {
      // Reconsulta configs tras solicitar actualización
      setTimeout(() => loadConfigs(), 200);
    }
  }, [loadConfigs, useNativeSelector, openNativeSelector]);

  // Resetear búsqueda al cambiar de categoría (pero sin cerrar grupos ya abiertos)
  useEffect(() => {
    setQuery("");
    setDebouncedQuery("");
  }, [selectedCategory]);

  // Cleanup effect - ya no necesario para pantalla fija
  // Los estados se mantienen durante la sesión de la pantalla

  // Derivados para estados
  const hasConfigs = configs.length > 0;

  const activeCategory = useMemo(() => {
    if (!activeConfig) return null;
    return configs.find((c) => c.items.some((it) => it.id === activeConfig.id)) || null;
  }, [configs, activeConfig]);

  const filteredCategories = useMemo(() => 
    filterCategoriesWithItems(configs, query)
  , [configs, query]);

  const filteredItems = useMemo((): ConfigItem[] => {
    if (selectedCategory) return filterByQuery(selectedCategory.items, query);
    // Búsqueda global cuando no hay categoría seleccionada
    const allItems = configs.flatMap(c => c.items);
    return filterByQuery(allItems, query);
  }, [selectedCategory, query, configs]);

  // Auto seleccionar primera categoría si el usuario comienza a escribir y no hay categoría aún
  useEffect(() => {
    if (!selectedCategory && query.trim().length > 0 && configs.length > 0) {
      setSelectedCategory(configs[0]);
    }
  }, [query, selectedCategory, configs]);

  // Agrupación por subcategorías usando utilidades reutilizables
  const groupedItems = useMemo((): Group<ConfigItem>[] => {
    const specs = getSubcategorySpecs(t);
    const groups = groupItemsByCategory<ConfigItem>(filteredItems, specs, t);
    
    // Ordenar items dentro de cada grupo
    groups.forEach(group => {
      group.items.sort((a, b) => {
        if (group.key === "premium-ssh") {
          const numA = extractPremiumNumber(a);
          const numB = extractPremiumNumber(b);
          return numA - numB;
        }
        return (a.name || "").localeCompare(b.name || "");
      });
    });
    
    return groups;
  }, [filteredItems, t]);

  // UI State helpers
  const toggleGroup = useCallback((groupKey: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  }, []);

  const isGroupExpanded = useCallback((groupKey: string) => {
    return expandedGroups[groupKey] ?? false; // Default: colapsado
  }, [expandedGroups]);

  // Height calculations
  const statusBarHeight = getStatusBarHeight();
  const navigationBarHeight = getNavigationBarHeight();
  const scrollBottomPadding = navigationBarHeight + 16;

  // Computed values
  const cleanSelectedCategoryName = selectedCategory ? getCleanCategoryName(selectedCategory.name) : null;
  const selectedCategoryType = selectedCategory ? getCategoryType(selectedCategory) : null;
  const selectedCategoryStyles = selectedCategoryType ? getCategoryTypeStyles(selectedCategoryType, t) : null;
  const headerTitle = selectedCategory ? cleanSelectedCategoryName ?? selectedCategory.name : t.serverSelectorScreen.header.categories;

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
  cleanSelectedCategoryName,
  selectedCategoryType,
  selectedCategoryStyles,
    useNativeSelector,
    loadError,
    
    // Datos computados
    filteredCategories,
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
