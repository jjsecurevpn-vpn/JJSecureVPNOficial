import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import type { VpnStatus, ServerConfig, Category, UserInfo, Credentials, AutoState, ScreenType } from '../types';
import { dt, callOne, getBestIP, getOperator, getAppVersions } from '../utils/nativeApi';
import { onNativeEvent } from '../utils/nativeEvents';
import { loadCredentials, saveCredentials, isTermsAccepted, acceptTerms as acceptTermsStorage } from '../utils/storageUtils';
import { MINIMUM_REQUIRED_VERSION, SCREENS } from '../constants';
import { compareVersions, toPingNumber } from '../utils/formatUtils';

interface VpnContextType {
  // Estado
  status: VpnStatus;
  config: ServerConfig | null;
  categorias: Category[];
  user: UserInfo | null;
  creds: Credentials;
  auto: AutoState;
  screen: ScreenType;
  termsAccepted: boolean;
  needsUpdate: boolean;

  // Acciones
  setScreen: (s: ScreenType) => void;
  setConfig: (c: ServerConfig) => void;
  setCreds: (c: Partial<Credentials>) => void;
  connect: () => void;
  disconnect: () => void;
  cancelConnecting: () => void;
  startAutoConnect: (cat?: Category) => void;
  loadCategorias: () => void;
  acceptTerms: () => void;

  // Info
  topInfo: { op: string; ip: string; ver: string };
  pingMs: number | null;
}

const VpnContext = createContext<VpnContextType | null>(null);

export function VpnProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<VpnStatus>('DISCONNECTED');
  const [config, setConfigState] = useState<ServerConfig | null>(null);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [creds, setCredsState] = useState<Credentials>(loadCredentials());
  const [screen, setScreenState] = useState<ScreenType>('home');
  const [termsAccepted, setTermsAccepted] = useState(isTermsAccepted());
  const [topInfo, setTopInfo] = useState({ op: '—', ip: '—', ver: '-' });
  const [pingMs, setPingMs] = useState<number | null>(null);
  const userFetchRef = useRef({ pending: false, lastAt: 0 });

  const autoRef = useRef<AutoState>({
    on: false,
    tmo: null,
    ver: null,
    list: [],
    i: 0,
  });

  // Verificar si necesita actualización
  const currentVersion = dt.call<string>('DtAppVersion') || '0.0.0';
  const needsUpdate = compareVersions(currentVersion, MINIMUM_REQUIRED_VERSION) < 0;

  // Cargar categorías
  const loadCategorias = useCallback(() => {
    try {
      const raw = dt.call<string>('DtGetConfigs');
      let cats: Category[] = JSON.parse(raw || '[]');
      cats.sort((a, b) => (a.sorter || 0) - (b.sorter || 0));
      cats.forEach(c => c.items?.sort((a, b) => (a.sorter || 0) - (b.sorter || 0)));
      setCategorias(cats);
    } catch {
      setCategorias([]);
    }
  }, []);

  // Actualizar top info
  const updateTopInfo = useCallback(() => {
    setTopInfo({
      op: getOperator(),
      ip: getBestIP(config || undefined),
      ver: getAppVersions(),
    });
  }, [config]);

  const refreshPing = useCallback(() => {
    const raw = dt.call<string | number>('DtGetPingResult');
    const parsed = toPingNumber(raw ?? null);
    if (Number.isFinite(parsed)) {
      setPingMs(prev => (prev === parsed ? prev : parsed));
    } else {
      setPingMs(null);
    }
  }, []);

  const handleUserData = useCallback((dataInput: unknown) => {
    try {
      const parsed = typeof dataInput === 'string' ? JSON.parse(dataInput) : dataInput;
      if (!parsed || typeof parsed !== 'object') return;
      const payload = parsed as Record<string, unknown>;

      const pick = (keys: string[], fallback?: unknown) => {
        for (const key of keys) {
          const value = payload[key];
          if (value !== undefined && value !== null && value !== '') return value;
        }
        return fallback;
      };

      const username = pick(['username', 'user', 'name'], creds.user || 'usuario');
      const expirationDate = pick(['expiration_date', 'expirationDate', 'expire_date']);
      const limitConnections = pick(['limit_connections', 'limitConnections', 'max_connections']);
      const countConnections = pick(['count_connections', 'countConnections', 'connections']);

      setUser(prev => ({
        name: String(username ?? prev?.name ?? creds.user ?? 'usuario'),
        expiration_date: String(expirationDate ?? prev?.expiration_date ?? '-'),
        limit_connections: String(limitConnections ?? prev?.limit_connections ?? '-'),
        count_connections: Number(countConnections ?? prev?.count_connections ?? 0) || 0,
      }));

      userFetchRef.current.pending = false;
      userFetchRef.current.lastAt = Date.now();
    } catch (error) {
      console.error('❌ Error parsing user data:', error);
      userFetchRef.current.pending = false;
    }
  }, [creds.user]);

  const requestUserInfo = useCallback((force = false) => {
    const now = Date.now();
    const { pending, lastAt } = userFetchRef.current;
    const recentlyFetched = now - lastAt < 5000; // 5s de margen

    if (!force && (pending || recentlyFetched)) {
      return;
    }

    userFetchRef.current.pending = true;
    userFetchRef.current.lastAt = now;

    let resolved = false;

    const readDirect = () => {
      const raw = dt.call<string>('DtGetUserInfo');
      if (raw) {
        resolved = true;
        handleUserData(raw);
      } else {
        userFetchRef.current.pending = false;
      }
    };

    try {
      const win = window as unknown as Record<string, { execute?: () => void }>;
      const dtCheck = win.DtStartCheckUser;
      if (dtCheck?.execute) {
        dtCheck.execute();
        setTimeout(() => {
          if (!resolved) readDirect();
        }, 600);
        setTimeout(() => {
          if (!resolved) readDirect();
        }, 2000);
        return;
      }
    } catch (error) {
      console.warn('DtStartCheckUser no disponible directamente', error);
    }

    readDirect();
  }, [handleUserData]);

  // Push credentials al bridge
  const pushCreds = useCallback(() => {
    dt.set('DtUsername', creds.user);
    dt.set('DtPassword', creds.pass);
    dt.set('DtUuid', creds.uuid);
  }, [creds]);

  // Setters
  const setConfig = useCallback((c: ServerConfig) => {
    dt.call('DtSetConfig', c.id);
    setConfigState(c);
  }, []);

  const setScreen = useCallback((next: ScreenType) => {
    if (!SCREENS.includes(next)) return;
    setScreenState(current => (current === next ? current : next));
  }, []);

  const setCreds = useCallback((partial: Partial<Credentials>) => {
    setCredsState(prev => {
      const next = { ...prev, ...partial };
      saveCredentials(next.user, next.pass, next.uuid);
      return next;
    });
  }, []);

  const acceptTerms = useCallback(() => {
    acceptTermsStorage();
    setTermsAccepted(true);
    callOne(['DtAcceptTerms']);
  }, []);

  // Limpiar timers de auto
  const clearAutoTimers = useCallback(() => {
    if (autoRef.current.tmo) clearTimeout(autoRef.current.tmo);
    if (autoRef.current.ver) clearInterval(autoRef.current.ver);
    autoRef.current.tmo = null;
    autoRef.current.ver = null;
  }, []);

  // Conectar
  const connect = useCallback(() => {
    if (!config) return;
    pushCreds();
    saveCredentials(creds.user, creds.pass, creds.uuid);
    dt.call('DtSetConfig', config.id);
    dt.call('DtExecuteVpnStart');
    setStatus('CONNECTING');
  }, [config, creds, pushCreds]);

  // Desconectar
  const disconnect = useCallback(() => {
    autoRef.current.on = false;
    clearAutoTimers();
    dt.call('DtExecuteVpnStop');
    setStatus('DISCONNECTED');
  }, [clearAutoTimers]);

  // Cancelar conexión
  const cancelConnecting = useCallback(() => {
    autoRef.current.on = false;
    clearAutoTimers();
    dt.call('DtExecuteVpnStop');
    setStatus('DISCONNECTED');
  }, [clearAutoTimers]);

  // Auto connect - next server
  const nextAuto = useCallback(() => {
    const auto = autoRef.current;
    if (!auto.on) return;
    if (auto.i >= auto.list.length) {
      auto.on = false;
      setStatus('DISCONNECTED');
      return;
    }
    const srv = auto.list[auto.i++];
    dt.call('DtSetConfig', srv.id);
    setConfigState(srv);
    setTimeout(() => {
      pushCreds();
      dt.call('DtExecuteVpnStart');
    }, 120);

    clearAutoTimers();
    auto.tmo = setTimeout(() => {
      dt.call('DtExecuteVpnStop');
      setTimeout(nextAuto, 350);
    }, 10000);

    auto.ver = setInterval(() => {
      const st = dt.call<string>('DtGetVpnState') || 'DISCONNECTED';
      if (!auto.on) {
        clearAutoTimers();
        return;
      }
      if (st === 'CONNECTED') {
        clearAutoTimers();
        setStatus('CONNECTED');
        auto.on = false;
        requestUserInfo(true);
      } else if (['AUTH_FAILED', 'NO_NETWORK', 'STOPPING'].includes(st)) {
        clearAutoTimers();
        dt.call('DtExecuteVpnStop');
        setTimeout(nextAuto, 350);
      }
    }, 600);
  }, [clearAutoTimers, pushCreds, requestUserInfo]);

  // Iniciar auto connect
  const startAutoConnect = useCallback((cat?: Category) => {
    if (status === 'CONNECTED' || status === 'CONNECTING') return;

    pushCreds();
    saveCredentials(creds.user, creds.pass, creds.uuid);
    clearAutoTimers();

    let list: ServerConfig[] = [];
    if (cat?.items?.length) {
      list = cat.items.slice();
    } else {
      categorias.forEach(c => c.items && list.push(...c.items));
    }

    if (!list.length) return;

    autoRef.current.on = true;
    autoRef.current.list = list;
    autoRef.current.i = 0;
    setStatus('CONNECTING');
    setScreen('home');
    nextAuto();
  }, [status, creds, categorias, pushCreds, clearAutoTimers, nextAuto]);

  useEffect(() => {
    const offVpn = onNativeEvent('DtVpnStateEvent', state => {
      const st = (typeof state === 'string' ? state : String(state || 'DISCONNECTED')) as VpnStatus;
      setStatus(st);
      if (st === 'CONNECTED') {
        requestUserInfo(true);
      } else if (st === 'DISCONNECTED') {
        setUser(null);
      }
    });

    const offUserResult = onNativeEvent('DtCheckUserResultEvent', handleUserData);
    const offUserModel = onNativeEvent('DtCheckUserModelEvent', handleUserData);

    const offConfigSelected = onNativeEvent('DtConfigSelectedEvent', payload => {
      try {
        if (!payload) return;
        const cfg = (typeof payload === 'string' ? JSON.parse(payload) : payload) as ServerConfig;
        setConfigState(cfg);
      } catch (error) {
        console.error('❌ Error parsing config payload:', error);
      }
    });

    const offNewDefault = onNativeEvent('DtNewDefaultConfigEvent', () => {
      loadCategorias();
    });

    return () => {
      offVpn();
      offUserResult();
      offUserModel();
      offConfigSelected();
      offNewDefault();
    };
  }, [handleUserData, loadCategorias, requestUserInfo]);

  // Polling VPN state (fallback si no hay eventos)
  useEffect(() => {
    const interval = setInterval(() => {
      const st = dt.call<string>('DtGetVpnState') as VpnStatus | null;
      if (st && st !== status) {
        setStatus(st);
      }
      updateTopInfo();
    }, 800);
    return () => clearInterval(interval);
  }, [status, updateTopInfo]);

  // Solicitar datos del usuario cuando cambie a CONNECTED por cualquier otra vía
  useEffect(() => {
    if (status === 'CONNECTED') {
      requestUserInfo(true);
    }
  }, [status, requestUserInfo]);

  useEffect(() => {
    if (status !== 'CONNECTED') return undefined;
    if (user?.expiration_date && user.expiration_date !== '-') return undefined;

    const interval = setInterval(() => {
      requestUserInfo();
    }, 5000);
    return () => clearInterval(interval);
  }, [status, user?.expiration_date, requestUserInfo]);

  useEffect(() => {
    if (status !== 'CONNECTED') {
      setPingMs(null);
      return undefined;
    }
    refreshPing();
    const interval = setInterval(() => {
      refreshPing();
    }, 2000);
    return () => clearInterval(interval);
  }, [status, refreshPing]);

  // Init
  useEffect(() => {
    loadCategorias();
    const cfg = dt.jsonConfigAtual;
    if (cfg) setConfigState(cfg);
    pushCreds();
    updateTopInfo();
  }, [loadCategorias, pushCreds, updateTopInfo]);

  const value: VpnContextType = {
    status,
    config,
    categorias,
    user,
    creds,
    auto: autoRef.current,
    screen,
    termsAccepted,
    needsUpdate,
    setScreen,
    setConfig,
    setCreds,
    connect,
    disconnect,
    cancelConnecting,
    startAutoConnect,
    loadCategorias,
    acceptTerms,
    topInfo,
    pingMs,
  };

  return <VpnContext.Provider value={value}>{children}</VpnContext.Provider>;
}

export function useVpn() {
  const ctx = useContext(VpnContext);
  if (!ctx) throw new Error('useVpn must be used within VpnProvider');
  return ctx;
}
