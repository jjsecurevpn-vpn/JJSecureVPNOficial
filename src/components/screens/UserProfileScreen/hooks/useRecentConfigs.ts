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
    const handler = (payload: unknown) => {
      try {
        const p = payload as Record<string, unknown> | null;
        const item: RecentConfigItem = {
          id: p?.id as number | undefined,
          name: p?.name as string | undefined,
          mode: p?.mode as string | undefined,
          description: p?.description as string | undefined,
          icon: p?.icon as string | undefined,
          timestamp: Date.now(),
        };
        setRecent(prev => {
          const existing = prev.filter(prev => prev.id !== item.id);
          const next = [item, ...existing].slice(0, max);
            return next;
        });
      } catch {
        // ignore
      }
    };
    const w = window as unknown as Record<string, unknown>;
    w.DtConfigSelectedEvent = handler;
    return () => {
      if ((window as unknown as Record<string, unknown>).DtConfigSelectedEvent === handler) {
        (window as unknown as Record<string, unknown>).DtConfigSelectedEvent = undefined;
      }
    };
  }, [max]);

  return recent;
}
