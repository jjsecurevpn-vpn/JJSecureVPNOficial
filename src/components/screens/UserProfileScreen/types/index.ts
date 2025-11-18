/**
 * @file types/index.ts
 * @description Tipos específicos para UserProfileScreen
 */

// UserProfileScreenProps eliminado (no se usan props actualmente)

export interface UserData {
  username: string;
  expiration_date: string;
  expiration_days: number;
  limit_connections: number;
  count_connections: number;
}

// UserProfileState eliminado: el hook expone estado directamente
