/**
 * @file useUserProfile.ts
 * @description Hook personalizado para la lógica de UserProfileScreen
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useUnifiedVpn } from "../../../../hooks/useUnifiedVpn";
import { interceptDtunnelModals } from "../../../../utils/modalInterceptor";
import { useTranslations } from "../../../../context/LanguageContext";
import type { UserData } from "../types";

const TIMEOUT_CHECK_USER = 30000; // ms para timeout de consulta
const ENABLE_DEBUG = false; // poner true para debug puntual

export function useUserProfile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations();

  const { isConnected, isConnecting } = useUnifiedVpn();

  const fetchUserData = useCallback(() => {
    setIsLoading(true);
    setError(null);

    const handleUserEvent = (userDataJson: string | object) => {
      try {
        console.log("🔍 UserProfile - Datos recibidos:", userDataJson);
        
        // Manejar tanto string como objeto
        const data = typeof userDataJson === 'string' 
          ? JSON.parse(userDataJson) 
          : userDataJson;

        console.log("📊 UserProfile - Datos parseados:", data);

        if (!data || data.error || data.status === "error") {
          setError(data?.message || t.userProfileScreen.errors.serverError);
          setIsLoading(false);
          return;
        }

        if (!data.username || !data.expiration_date) {
          setError(t.userProfileScreen.errors.userNotFound);
          setIsLoading(false);
          return;
        }

        const processedUserData = {
          username: data.username,
          expiration_date: data.expiration_date,
          expiration_days: parseInt(data.expiration_days),
          limit_connections: parseInt(data.limit_connections) || 1,
          count_connections: parseInt(data.count_connections) || 0,
        };

        console.log("✅ UserProfile - Datos procesados:", processedUserData);
        
        setUserData(processedUserData);
        setIsLoading(false);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      } catch (error) {
        console.error("❌ UserProfile - Error procesando datos:", error);
        setError(t.userProfileScreen.errors.processingError);
        setIsLoading(false);
      }
    };

  if (ENABLE_DEBUG) console.log("🚀 UserProfile - Configurando evento DtCheckUserResultEvent");
    (window as any).DtCheckUserResultEvent = handleUserEvent;

    if (!(window as any).DtStartCheckUser?.execute) {
      console.error("❌ UserProfile - Función DTunnel no disponible");
      setError(t.userProfileScreen.errors.dtunnelNotAvailable);
      setIsLoading(false);
      return;
    }

    try {
  if (ENABLE_DEBUG) console.log("🔄 UserProfile - Ejecutando DtStartCheckUser");
      (window as any).DtStartCheckUser.execute();
      timeoutRef.current = setTimeout(() => {
        if (ENABLE_DEBUG) console.warn("⏰ UserProfile - Timeout alcanzado");
        setError("Timeout: No se recibió respuesta del servidor");
        setIsLoading(false);
      }, TIMEOUT_CHECK_USER);
    } catch (error) {
      console.error("❌ UserProfile - Error ejecutando consulta:", error);
      setError("Error al ejecutar consulta de usuario");
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isConnected) {
      // Activar interceptor para usar datos de prueba
      console.log("🎯 UserProfile - Activando interceptor modal");
      interceptDtunnelModals.start();
      
      fetchUserData();
    } else {
      setUserData(null);
      setIsLoading(false);
      setError(null);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      (window as any).DtCheckUserResultEvent = undefined;
      
      // Desactivar interceptor cuando no esté conectado
      interceptDtunnelModals.stop();
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      (window as any).DtCheckUserResultEvent = undefined;
    };
  }, [isConnected, fetchUserData]);

  const handleContactSupport = useCallback(() => {
    // Abrir WhatsApp con el número de soporte
    if (window.DtOpenWebview) {
      window.DtOpenWebview.execute("https://wa.me/5493812531123");
    } else if (window.DtStartWebViewActivity) {
      window.DtStartWebViewActivity.execute("https://wa.me/5493812531123");
    } else {
      // Fallback para desarrollo
      window.open("https://wa.me/5493812531123", "_blank");
    }
  }, []);

  const handleRenew = useCallback(() => {
    window.DtStartWebViewActivity?.execute("https://wa.me/5493812531123");
  }, []);

  return {
    // Estado
    userData,
    isLoading,
    error,
    isConnected,
    isConnecting,
    
    // Acciones
    fetchUserData,
    handleContactSupport,
    handleRenew,
  };
}
