import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { CheckCircle2, AlertCircle, Lock, Loader2 } from "lucide-react";
import { Spinner } from "../ui/Spinner";
import { nativeAPI } from "../../utils/unifiedNativeAPI";
import { useTranslations } from "../../hooks/useTranslations.ts";
import { useActiveConfig } from "../../context/ActiveConfigContext";
import { registerCredentialFlushHandler } from "../../utils/credentialSync";
import { CredentialFields } from "./CredentialFields";

interface CredentialsPanelProps {
  isConnecting?: boolean;
}

export const CredentialsPanel: React.FC<CredentialsPanelProps> = ({ isConnecting }) => {
  const { t } = useTranslations();
  const [showPassword, setShowPassword] = useState(false);
  const [showUUID, setShowUUID] = useState(false);
  // Eliminado estado credLoading (no necesario con guardado automático visible por autoStatus)
  const [autoStatus, setAutoStatus] = useState<'idle' | 'pending' | 'saving' | 'saved'>('idle');
  const saveTimerRef = useRef<number | null>(null);
  const lastSavedRef = useRef<{ username: string; password: string; uuid: string; hysteriaUser: string; hysteriaPass: string }>({ username: '', password: '', uuid: '', hysteriaUser: '', hysteriaPass: '' });
  const [fieldErrors, setFieldErrors] = useState<{ [k: string]: string }>({});
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [uuid, setUuid] = useState("");
  const [hysteriaUser, setHysteriaUser] = useState("");
  const [hysteriaPass, setHysteriaPass] = useState("");

  // Config activa reactiva (en lugar de snapshot inicial con getActiveConfig())
  const { activeConfig } = useActiveConfig();
  const mode = activeConfig?.mode?.toLowerCase() || "";
  const serverName = activeConfig?.name?.toLowerCase() || "";
  const serverDescription = activeConfig?.description?.toLowerCase() || "";
  const isHysteria = mode.includes("hysteria");
  const isV2Ray = mode.startsWith("v2ray");
  
  // Detectar si es "Hysteria Gratuito" específicamente
  const isHysteriaGratuito = isHysteria && (
    serverName.includes("gratuito") || 
    serverName.includes("free") ||
    serverDescription.includes("gratuito") ||
    serverDescription.includes("free")
  );

  // Usamos la lógica centralizada (nativeAPI.auth.shouldShowInput) para determinar qué inputs faltan realmente
  // Para Hysteria: mostramos los inputs NORMALES (username/password) en lugar de los especiales
  const needsUsername = nativeAPI.auth.shouldShowInput("username");
  const needsPassword = nativeAPI.auth.shouldShowInput("password");
  const needsUUID = useMemo(() => isV2Ray && nativeAPI.auth.shouldShowInput("uuid"), [isV2Ray, activeConfig?.auth?.v2ray_uuid]);
  const showHysteriaInput = false; // Deshabilitado: siempre usamos inputs normales
  const showUsernameInput = needsUsername;
  const showPasswordInput = needsPassword;
  const showUUIDInput = needsUUID;

  // Carga / sincroniza credenciales actuales cuando cambia el tipo de modo o config activa
  useEffect(() => {
    const currentUsername = nativeAPI.auth.getUsername() || "";
    const currentPassword = nativeAPI.auth.getPassword() || "";
    setUuid(nativeAPI.auth.getUUID() || "");

    // Si es Hysteria Gratuito, pre-llenar con "secure"
    if (isHysteriaGratuito) {
      setUsername("secure");
      setPassword("secure");
      // También guardar en nativeAPI para que esté listo
      nativeAPI.auth.setUsername("secure:secure");
      nativeAPI.auth.setPassword("secure:secure");
    } else if (isHysteria) {
      // Hysteria normal: las credenciales pueden venir combinadas como user:pass
      // Si tenía "secure" del servidor anterior, limpiar
      const cleanUsername = currentUsername === "secure:secure" ? "" : currentUsername;
      const cleanPassword = currentPassword === "secure:secure" ? "" : currentPassword;
      
      if (cleanUsername && cleanUsername.includes(":")) {
        const [u, p] = cleanUsername.split(":", 2);
        setUsername(u || "");
        setPassword(p || "");
      } else if (cleanPassword && cleanPassword.includes(":")) {
        const [u, p] = cleanPassword.split(":", 2);
        setUsername(u || "");
        setPassword(p || "");
      } else {
        setUsername(cleanUsername);
        setPassword(cleanPassword);
      }
    } else {
      // Otros servidores: limpiar si tenía "secure" del servidor anterior
      const cleanUsername = (currentUsername === "secure:secure" || currentUsername === "secure") ? "" : currentUsername;
      const cleanPassword = (currentPassword === "secure:secure" || currentPassword === "secure") ? "" : currentPassword;
      setUsername(cleanUsername);
      setPassword(cleanPassword);
      // Limpiar también en nativeAPI si tenía secure
      if (currentUsername === "secure:secure" || currentUsername === "secure") {
        nativeAPI.auth.setUsername("");
      }
      if (currentPassword === "secure:secure" || currentPassword === "secure") {
        nativeAPI.auth.setPassword("");
      }
    }
  }, [isHysteria, isHysteriaGratuito, isV2Ray, activeConfig?.id]);

  // Limpiar error general cuando cambien las credenciales
  useEffect(() => {
    if (fieldErrors.general) {
      setFieldErrors(prev => {
        const { general, ...rest } = prev;
        return rest;
      });
    }
  }, [username, password, hysteriaUser, hysteriaPass, uuid, fieldErrors.general]);

  const validateCreds = useCallback(() => {
    const errors: { [k: string]: string } = {};
    let valid = true;

    if (showHysteriaInput) {
      if (!hysteriaUser.trim()) {
        errors.hysteriaUser = t.credentialsPanel.errors.userRequired;
        valid = false;
      }
      if (!hysteriaPass.trim()) {
        errors.hysteriaPass = t.credentialsPanel.errors.passwordRequired;
        valid = false;
      }
    } else {
      if (showUsernameInput && !username.trim()) {
        errors.username = t.credentialsPanel.errors.userRequired;
        valid = false;
      }
      if (showPasswordInput && !password.trim()) {
        errors.password = t.credentialsPanel.errors.passwordRequired;
        valid = false;
      }
    }
    if (showUUIDInput && !uuid.trim()) {
      errors.uuid = t.credentialsPanel.errors.uuidRequired;
      valid = false;
    } else if (showUUIDInput && uuid.trim()) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(uuid.trim())) {
        errors.uuid = t.credentialsPanel.errors.uuidInvalid;
        valid = false;
      }
    }

    setFieldErrors(errors);
    return valid;
  }, [showHysteriaInput, hysteriaUser, hysteriaPass, showUsernameInput, username, showPasswordInput, password, showUUIDInput, uuid]);

  const persistCreds = useCallback(() => {
    if (!validateCreds()) return false;
    // Evitar escrituras redundantes
    if (
      lastSavedRef.current.username === username &&
      lastSavedRef.current.password === password &&
      lastSavedRef.current.uuid === uuid &&
      lastSavedRef.current.hysteriaUser === hysteriaUser &&
      lastSavedRef.current.hysteriaPass === hysteriaPass
    ) {
      return false;
    }
    setAutoStatus('saving');
    // Para Hysteria: combinar user:pass pero usando los inputs normales
    if (isHysteria) {
      const combined = `${username.trim()}:${password.trim()}`;
      if (combined && combined !== ':') {
        nativeAPI.auth.setUsername(combined);
        nativeAPI.auth.setPassword(combined);
      }
    } else {
      nativeAPI.auth.setUsername(username);
      nativeAPI.auth.setPassword(password);
    }
    if (showUUIDInput) {
      nativeAPI.auth.setUUID(uuid);
    }
    lastSavedRef.current = { username, password, uuid, hysteriaUser, hysteriaPass };
    // Pequeño delay visual
    setTimeout(() => {
      setAutoStatus('saved');
      // Volver a idle después de un breve lapso
      setTimeout(() => {
        if (autoStatus === 'saved') setAutoStatus('idle');
      }, 1500);
    }, 250);
    return true;
  }, [validateCreds, isHysteria, hysteriaUser, hysteriaPass, username, password, showUUIDInput, uuid, autoStatus]);

  const flushPendingChanges = useCallback(() => {
    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    return persistCreds();
  }, [persistCreds]);

  useEffect(() => {
    const unregister = registerCredentialFlushHandler(flushPendingChanges);
    return () => {
      unregister();
    };
  }, [flushPendingChanges]);

  // Debounce automático en cambios de campos relevantes
  useEffect(() => {
    // Determinar si hay cambios frente a último guardado
    const changed = (
      lastSavedRef.current.username !== username ||
      lastSavedRef.current.password !== password ||
      lastSavedRef.current.uuid !== uuid ||
      lastSavedRef.current.hysteriaUser !== hysteriaUser ||
      lastSavedRef.current.hysteriaPass !== hysteriaPass
    );
    if (!changed) return; // nada que hacer
    if (autoStatus !== 'saving') setAutoStatus('pending');
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => {
      persistCreds();
    }, 700); // debounce 700ms
    return () => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, [username, password, uuid, hysteriaUser, hysteriaPass, persistCreds, autoStatus]);



  return (
  <div className="max-w-lg mx-auto space-y-4 font-sans">
      {isConnecting && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-brand/10 border border-brand/20">
          <Spinner size="sm" color="brand" inline />
          <span className="text-brand-accent text-caption font-medium tracking-[0.2px]">
            {t.credentialsPanel.connecting}
          </span>
        </div>
      )}

  <div className="mb-4 p-4 panel-base">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center shadow-subtle">
            <Lock className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-neutral-strong text-[14px] font-semibold leading-5">
              {isHysteria ? t.credentialsPanel.header.hysteria : isV2Ray ? t.credentialsPanel.header.v2ray : t.credentialsPanel.header.ssh}
            </h3>
            <p className="text-neutral-text mt-0.5 text-caption">
              {isHysteria ? t.credentialsPanel.headerDesc.hysteria : t.credentialsPanel.headerDesc.ssh}
            </p>
          </div>
        </div>
      </div>

      <CredentialFields
        t={t}
        showHysteriaInput={showHysteriaInput}
        showUsernameInput={showUsernameInput}
        showPasswordInput={showPasswordInput}
        showUUIDInput={showUUIDInput}
        showPassword={showPassword}
        toggleShowPassword={() => setShowPassword((v) => !v)}
        showUUID={showUUID}
        toggleShowUUID={() => setShowUUID((v) => !v)}
        username={username}
        onUsernameChange={setUsername}
        password={password}
        onPasswordChange={setPassword}
        uuid={uuid}
        onUuidChange={setUuid}
        hysteriaUser={hysteriaUser}
        onHysteriaUserChange={setHysteriaUser}
        hysteriaPass={hysteriaPass}
        onHysteriaPassChange={setHysteriaPass}
        fieldErrors={fieldErrors}
        isHysteriaGratuito={isHysteriaGratuito}
      />

      {/* Error general */}
      {fieldErrors.general && (
        <div 
          className="flex items-center gap-2 text-red-400 p-3 rounded-lg bg-red-500/10 border border-red-500/20" 
          style={{ 
            fontSize: '12px', 
            fontWeight: 500, 
            lineHeight: '16px' 
          }}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
          {fieldErrors.general}
        </div>
      )}

      {/* Barra de estado de guardado automático */}
      <div className="flex items-center justify-end gap-2 pt-1 min-h-[28px]">
        {autoStatus === 'pending' && (
          <div className="text-[11px] text-neutral-text flex items-center gap-1">{t.credentialsPanel.statusMessages?.pending || 'Pendiente'}</div>
        )}
        {autoStatus === 'saving' && (
          <div className="text-[11px] text-brand flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" strokeWidth={2} />
            {t.credentialsPanel.statusMessages?.autoSaving || 'Guardando...'}
          </div>
        )}
        {autoStatus === 'saved' && (
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
            {t.credentialsPanel.statusMessages?.saved || 'Guardado'}
          </div>
        )}
      </div>

  <div className="mt-4 p-4 panel-base text-neutral-text text-[11px] leading-4">
        <div className="space-y-2">
          <div className="bullet-row">
            <div className="bullet-dot-brand" />
            <p><span className="text-neutral-strong font-medium">{t.credentialsPanel.secureInfo.title}</span> {t.credentialsPanel.secureInfo.desc}</p>
          </div>
          <div className="bullet-row">
            <div className="bullet-dot-muted" />
            <p>{t.credentialsPanel.secureInfo.connectNote}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
