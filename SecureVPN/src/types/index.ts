// Tipos para la aplicación Secure Tunnel

export interface ServerAuth {
  username?: string;
  password?: string;
  uuid?: string;
}

export interface ServerConfig {
  id: string;
  name: string;
  description?: string;
  mode: string;
  ip?: string;
  icon?: string;
  auth?: ServerAuth;
  sorter?: number;
}

export interface Category {
  name: string;
  items: ServerConfig[];
  sorter?: number;
}

export interface UserInfo {
  name: string;
  expiration_date: string;
  limit_connections: string;
  count_connections: number;
}

export interface Credentials {
  user: string;
  pass: string;
  uuid: string;
}

export interface AutoState {
  on: boolean;
  tmo: ReturnType<typeof setTimeout> | null;
  ver: ReturnType<typeof setInterval> | null;
  list: ServerConfig[];
  i: number;
}

export type VpnStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'AUTH_FAILED' | 'NO_NETWORK' | 'STOPPING';

type ScreenTuple = typeof import('../constants')['SCREENS'];
export type ScreenType = ScreenTuple[number];

export interface AppState {
  status: VpnStatus;
  categorias: Category[];
  config: ServerConfig | null;
  auto: AutoState;
  creds: Credentials;
  user: UserInfo | null;
}
