/**
 * @file useRecentConfigs.ts
 * @description Hook para mantener un historial pequeño de configuraciones seleccionadas (via evento nativo).
 */
import { useEffect, useState } from 'react';

export interface RecentConfigItem {
  id?: number;
  name?: string;
  mode?: string;
  description?: string;
  icon?: string;
  timestamp: number;
}

export function useRecentConfigs(max = 5) {
  const [recent, setRecent] = useState<RecentConfigItem[]>([]);

  useEffect(() => {
    const handler = (payload: any) => {
      try {
        const item: RecentConfigItem = {
          id: payload?.id,
          name: payload?.name,
          mode: payload?.mode,
          description: payload?.description,
          icon: payload?.icon,
          timestamp: Date.now(),
        };
        setRecent(prev => {
          const existing = prev.filter(p => p.id !== item.id);
          const next = [item, ...existing].slice(0, max);
            return next;
        });
      } catch {
        // ignore
      }
    };
    (window as any).DtConfigSelectedEvent = handler;
    return () => {
      if ((window as any).DtConfigSelectedEvent === handler) {
        (window as any).DtConfigSelectedEvent = undefined;
      }
    };
  }, [max]);

  return recent;
}
