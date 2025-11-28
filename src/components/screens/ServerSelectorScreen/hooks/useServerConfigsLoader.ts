import { useCallback, useEffect, useState } from 'react';
import { ConfigCategory } from '../../../../types/config';
import { nativeAPI } from '../../../../utils/unifiedNativeAPI';
import { checkForUpdates } from '../../../../utils/appFunctions';

interface LoaderMessages {
  noServersAvailable: string;
  loadError: string;
}

interface UseServerConfigsLoaderParams {
  useNativeSelector: boolean;
  setUseNativeSelector: (value: boolean) => void;
  refreshActiveConfig: () => void;
  openNativeSelector: () => void;
  messages: LoaderMessages;
  setLoadError: (value: string | null) => void;
}

function buildMockCategories(): ConfigCategory[] {
  return [
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
}

export function useServerConfigsLoader({
  useNativeSelector,
  setUseNativeSelector,
  refreshActiveConfig,
  openNativeSelector,
  messages,
  setLoadError,
}: UseServerConfigsLoaderParams) {
  const [configs, setConfigs] = useState<ConfigCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const loadConfigs = useCallback(() => {
    if (useNativeSelector) return;

    setLoading(true);
    setLoadError(null);

    try {
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

      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const forceMock = urlParams?.get('mockServers') === '1';
      const shouldMock = forceMock || !allConfigs || allConfigs.length === 0;
      const finalConfigs = shouldMock ? buildMockCategories() : allConfigs;

      if (!finalConfigs || finalConfigs.length === 0) {
        throw new Error(messages.noServersAvailable);
      }

      setConfigs(finalConfigs);
      refreshActiveConfig();
      setLoading(false);
    } catch (error) {
      console.error('🔴 [SERVER_SELECTOR] Error al cargar configuraciones:', error);
      setLoadError(error instanceof Error ? error.message : messages.loadError);

      setTimeout(() => {
        setLoading(false);
        if (error instanceof Error && error.message.includes('API') && !useNativeSelector) {
          console.warn('🟡 [SERVER_SELECTOR] Fallback automático al selector nativo');
          setUseNativeSelector(true);
          openNativeSelector();
        }
      }, 1000);
    }
  }, [messages.loadError, messages.noServersAvailable, openNativeSelector, refreshActiveConfig, setLoadError, setUseNativeSelector, useNativeSelector]);

  useEffect(() => {
    if (!useNativeSelector) {
      loadConfigs();
    }
  }, [loadConfigs, useNativeSelector]);

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
      console.error('🔴 [SERVER_SELECTOR] Error al actualizar:', error);
      setLoadError(messages.loadError);
    } finally {
      setTimeout(() => loadConfigs(), 200);
    }
  }, [loadConfigs, messages.loadError, openNativeSelector, setLoadError, useNativeSelector]);

  return {
    configs,
    loading,
    loadConfigs,
    handleUpdate,
  } as const;
}
