/**
 * @file useUserEvents.ts
 * @description Hook para eventos de usuario y configuración con sincronización automática
 */

import { useState, useEffect } from 'react';
import { onDtunnelEvent } from '../utils';

export interface UserEventState {
  username: string | null;
  expirationDays: string | null;
  limitConnections: string | null;
  countConnections: string | null;
  expirationDate: string | null;
  isCheckingUser: boolean;
  lastCheck: Date | null;
}

export interface ConfigEventState {
  hasNewDefaultConfig: boolean;
  selectedConfigId: number | null;
  selectedConfigName: string | null;
  lastConfigChange: Date | null;
}

/**
 * Hook que se sincroniza automáticamente con eventos de usuario
 */
export function useUserEvents() {
  const [userState, setUserState] = useState<UserEventState>({
    username: null,
    expirationDays: null,
    limitConnections: null,
    countConnections: null,
    expirationDate: null,
    isCheckingUser: false,
    lastCheck: null
  });

  useEffect(() => {
    // Evento de inicio de verificación de usuario
    const unsubscribeCheckStart = onDtunnelEvent('DtCheckUserStartedEvent', () => {
      setUserState(prev => ({
        ...prev,
        isCheckingUser: true
      }));
    });

    // Evento de resultado de verificación de usuario
    const unsubscribeCheckResult = onDtunnelEvent('DtCheckUserResultEvent', (result) => {
      setUserState(prev => ({
        ...prev,
        username: result.username,
        expirationDays: result.expiration_days,
        limitConnections: result.limit_connections,
        countConnections: result.count_connections,
        expirationDate: result.expiration_date,
        isCheckingUser: false,
        lastCheck: new Date()
      }));
    });

    return () => {
      unsubscribeCheckStart();
      unsubscribeCheckResult();
    };
  }, []);

  return userState;
}

/**
 * Hook que se sincroniza automáticamente con eventos de configuración
 */
export function useConfigEvents() {
  const [configState, setConfigState] = useState<ConfigEventState>({
    hasNewDefaultConfig: false,
    selectedConfigId: null,
    selectedConfigName: null,
    lastConfigChange: null
  });

  useEffect(() => {
    // Evento de nueva configuración por defecto
    const unsubscribeNewDefault = onDtunnelEvent('DtNewDefaultConfigEvent', () => {
      setConfigState(prev => ({
        ...prev,
        hasNewDefaultConfig: true,
        lastConfigChange: new Date()
      }));
    });

    // Evento de configuración seleccionada
    const unsubscribeConfigSelected = onDtunnelEvent('DtConfigSelectedEvent', (config) => {
      setConfigState(prev => ({
        ...prev,
        selectedConfigId: config.id,
        selectedConfigName: config.name,
        hasNewDefaultConfig: false,
        lastConfigChange: new Date()
      }));
    });

    return () => {
      unsubscribeNewDefault();
      unsubscribeConfigSelected();
    };
  }, []);

  return configState;
}
