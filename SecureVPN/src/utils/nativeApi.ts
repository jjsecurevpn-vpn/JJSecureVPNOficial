// Bridge para APIs nativas de DT (Digital Tunnel)

type DtApiName = string;

interface DtApi {
  execute?: (...args: unknown[]) => unknown;
  set?: (value: unknown) => void;
}

function getApi(name: DtApiName): DtApi | null {
  try {
    const api = (window as unknown as Record<string, unknown>)[name];
    if (api && typeof api === 'object') return api as DtApi;
    if (typeof api === 'function') return { execute: api as (...args: unknown[]) => unknown };
  } catch (e) {
    console.error('bridge error', name, e);
  }
  return null;
}

export const dt = {
  call<T = unknown>(name: DtApiName, ...args: unknown[]): T | null {
    try {
      const api = getApi(name);
      if (!api) return null;
      if (typeof api.execute === 'function') return api.execute(...args) as T;
    } catch (e) {
      console.error('bridge call', name, e);
    }
    return null;
  },

  set(name: DtApiName, value: unknown): void {
    try {
      const api = getApi(name);
      if (!api) return;
      if (typeof api.set === 'function') {
        api.set(value);
      } else if (typeof api.execute === 'function') {
        api.execute(value);
      }
    } catch (e) {
      console.error('bridge set', name, e);
    }
  },

  get jsonConfigAtual() {
    const c = this.call<string>('DtGetDefaultConfig');
    if (!c) return null;
    try {
      return typeof c === 'string' ? JSON.parse(c) : c;
    } catch {
      return null;
    }
  },
};

export function callOne(candidates: string[], ...args: unknown[]): boolean {
  for (const name of candidates) {
    const api = getApi(name);
    if (api && (typeof api.execute === 'function')) {
      dt.call(name, ...args);
      return true;
    }
  }
  return false;
}

export function getAppVersions(): string {
  const vCfg = dt.call<string>('DtGetLocalConfigVersion') || '-';
  const vApp = dt.call<string>('DtAppVersion') || '-';
  return `${vCfg}/${vApp}`;
}

export function getOperator(): string {
  return dt.call<string>('DtGetNetworkName') || '—';
}

export function getBestIP(config?: { ip?: string }): string {
  const local = dt.call<string>('DtGetLocalIP');
  const ip = local || dt.jsonConfigAtual?.ip || config?.ip || '—';
  const m = String(ip).match(/(\d{1,3}(?:\.\d{1,3}){3})/);
  return m ? m[1] : String(ip);
}

export function getLogs(): string {
  try {
    return (window as { DtGetLogs?: { execute: () => string } }).DtGetLogs?.execute() || 'Nenhum log';
  } catch {
    return 'Nenhum log';
  }
}

export function parseLogs(raw: string): string {
  try {
    const arr = JSON.parse(raw);
    return arr.map((o: Record<string, string>) => {
      const k = Object.keys(o)[0];
      return `[${k}] ${o[k].replace(/<[^>]*>/g, '')}`;
    }).join('\n');
  } catch {
    return raw;
  }
}
