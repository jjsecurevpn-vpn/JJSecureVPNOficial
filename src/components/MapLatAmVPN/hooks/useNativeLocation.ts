import { useState, useEffect, useCallback } from 'react';
import type { ConnectionState } from '../../../utils/connectionStates';

interface NativeLocationData {
  localIP?: string;
  networkName?: string;
  networkType?: 'MOBILE' | 'WIFI';
  hasConnection?: boolean;
}

interface UseNativeLocationProps {
  vpnState: ConnectionState;
  refreshInterval?: number;
}

export const useNativeLocation = ({ 
  vpnState, 
  refreshInterval = 10000 
}: UseNativeLocationProps) => {
  const [nativeData, setNativeData] = useState<NativeLocationData>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchNativeData = useCallback(() => {
    try {
      if (typeof window === 'undefined') return;

      const data: NativeLocationData = {};

      // Obtener IP local
      if (window.DtGetLocalIP) {
        const localIP = window.DtGetLocalIP.execute();
        data.localIP = localIP || undefined;
      }

      // Obtener datos detallados de red
      if (window.DtGetNetworkData) {
        const networkData = (window.DtGetNetworkData.execute() as unknown) as Record<string, unknown> | null;
        if (typeof networkData === 'object' && networkData !== null) {
          data.networkType = ((networkData as Record<string, unknown>)['type_name'] as unknown as 'MOBILE' | 'WIFI' | undefined) || undefined;
          data.hasConnection = ((networkData as Record<string, unknown>)['detailed_state'] as unknown as string | undefined) === 'CONNECTED';
          data.networkName = ((networkData as Record<string, unknown>)['name'] as unknown as string | undefined) || undefined;
        }
      }

      setNativeData(data);
      setIsLoading(false);
    } catch (error) {
      console.warn('Error obteniendo datos nativos:', error);
      setIsLoading(false);
    }
  }, []);

  // Fetch inicial
  useEffect(() => {
    fetchNativeData();
  }, [fetchNativeData]);

  // Refresh al cambiar estado VPN
  useEffect(() => {
    if (vpnState === "CONNECTED" || vpnState === "DISCONNECTED") {
      const timer = setTimeout(fetchNativeData, 1000);
      return () => clearTimeout(timer);
    }
  }, [vpnState, fetchNativeData]);

  // Refresh periódico
  useEffect(() => {
    const interval = setInterval(fetchNativeData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchNativeData, refreshInterval]);

  return { nativeData, isLoading, refresh: fetchNativeData };
};
