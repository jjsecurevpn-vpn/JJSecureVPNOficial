import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Eye, EyeOff, Key, CheckCircle2, AlertCircle, Lock, Loader2 } from "lucide-react";
import { Spinner } from "../ui/Spinner";
import { nativeAPI } from "../../utils/unifiedNativeAPI";
import { useTranslations } from "../../hooks/useTranslations.ts";
import { useActiveConfig } from "../../context/ActiveConfigContext";

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
  const isHysteria = mode.includes("hysteria");
  const isV2Ray = mode.startsWith("v2ray");

  // Usamos la lógica centralizada (nativeAPI.auth.shouldShowInput) para determinar qué inputs faltan realmente
  const needsUsername = useMemo(() => !isHysteria && nativeAPI.auth.shouldShowInput("username"), [isHysteria, activeConfig?.auth?.username]);
  const needsPassword = useMemo(() => !isHysteria && nativeAPI.auth.shouldShowInput("password"), [isHysteria, activeConfig?.auth?.password]);
  const needsUUID = useMemo(() => isV2Ray && nativeAPI.auth.shouldShowInput("uuid"), [isV2Ray, activeConfig?.auth?.v2ray_uuid]);
  const showHysteriaInput = isHysteria && (needsUsername || needsPassword); // si ambas credenciales vienen embebidas, no mostrar
  const showUsernameInput = needsUsername;
  const showPasswordInput = needsPassword;
  const showUUIDInput = needsUUID;

  // Carga / sincroniza credenciales actuales cuando cambia el tipo de modo o config activa
  useEffect(() => {
    const currentUsername = nativeAPI.auth.getUsername() || "";
    const currentPassword = nativeAPI.auth.getPassword() || "";
    setUuid(nativeAPI.auth.getUUID() || "");

    if (isHysteria) {
      // Hysteria: credenciales combinadas user:pass (si backend las embebe, ocultaremos inputs)
      if (currentUsername && currentUsername.includes(":")) {
        const [u, p] = currentUsername.split(":", 2);
        setHysteriaUser(u || "");
        setHysteriaPass(p || "");
      } else if (currentPassword && currentPassword.includes(":")) {
        const [u, p] = currentPassword.split(":", 2);
        setHysteriaUser(u || "");
        setHysteriaPass(p || "");
      } else {
        setHysteriaUser(currentUsername);
        setHysteriaPass(currentPassword);
      }
    } else {
      setUsername(currentUsername);
      setPassword(currentPassword);
    }
  }, [isHysteria, isV2Ray, activeConfig?.id]);

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
    // Simulación mínima (si hubiera async nativo podríamos await)
    if (isHysteria) {
      const combined = `${hysteriaUser.trim()}:${hysteriaPass.trim()}`;
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

      {showHysteriaInput && (
        <div className="space-y-4">
          <div className="text-neutral-strong flex items-center gap-2.5 text-[14px] font-semibold leading-5 tracking-[0.2px]">
            <Key className="w-4 h-4 text-brand" strokeWidth={1.5} />
            {t.credentialsPanel.hysteriaTitle}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-2">
              <div className="relative">
                <input
                  className={`input-base text-[14px] font-medium leading-5 ${
                    fieldErrors.hysteriaUser
                      ? 'input-error'
                      : hysteriaUser
                      ? 'input-valid'
                      : 'input-brand'
                  }`}
                  type="text"
                  placeholder={t.credentialsPanel.usernamePlaceholder}
                  value={hysteriaUser}
                  onChange={(e) => setHysteriaUser(e.target.value)}
                />
                {!fieldErrors.hysteriaUser && hysteriaUser && (
                  <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00b96b]" strokeWidth={1.5} />
                )}
              </div>
              {fieldErrors.hysteriaUser && (
                <div className="field-error-text" style={{ fontSize: '12px', lineHeight: '16px' }}>
                  <AlertCircle className="w-3 h-3" strokeWidth={1.5} />
                  {fieldErrors.hysteriaUser}
                </div>
              )}
            </div>

            <div className="flex-shrink-0 text-[#6d4aff] text-xl font-semibold px-2 font-mono">:</div>

            <div className="flex-1 space-y-2">
              <div className="relative">
                <input
                  className={`input-base pr-12 text-[14px] font-medium leading-5 ${
                    fieldErrors.hysteriaPass
                      ? 'input-error'
                      : hysteriaPass
                      ? 'input-valid'
                      : 'input-brand'
                  }`}
                  type={showPassword ? "text" : "password"}
                  placeholder={t.credentialsPanel.passwordPlaceholder}
                  value={hysteriaPass}
                  onChange={(e) => setHysteriaPass(e.target.value)}
                />
                <button type="button" className="icon-button-inline" onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? <EyeOff className="w-5 h-5" strokeWidth={1.5} /> : <Eye className="w-5 h-5" strokeWidth={1.5} />}
                </button>
              </div>
              {fieldErrors.hysteriaPass && (
                <div className="field-error-text" style={{ fontSize: '12px', lineHeight: '16px' }}>
                  <AlertCircle className="w-3 h-3" strokeWidth={1.5} />
                  {fieldErrors.hysteriaPass}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showUsernameInput && (
        <div className="space-y-2">
          <label className="text-neutral-strong flex items-center gap-2.5 text-[14px] font-semibold leading-5 tracking-[0.2px]">
            <span className="inline-flex w-4 h-4 items-center justify-center text-brand">@</span>
            {t.credentialsPanel.usernameLabel}
          </label>
          <div className="relative">
            <input
              className={`input-base text-[14px] font-medium leading-5 ${
                fieldErrors.username
                  ? 'input-error'
                  : username
                  ? 'input-valid'
                  : 'input-brand'
              }`}
              type="text"
              placeholder={t.credentialsPanel.usernamePlaceholder}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {!fieldErrors.username && username && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00b96b]" strokeWidth={1.5} />
            )}
          </div>
          {fieldErrors.username && (
            <div className="field-error-text" style={{ fontSize: '12px', lineHeight: '16px' }}>
              <AlertCircle className="w-3 h-3" strokeWidth={1.5} />
              {fieldErrors.username}
            </div>
          )}
        </div>
      )}

      {showPasswordInput && (
        <div className="space-y-2">
          <label className="text-neutral-strong flex items-center gap-2.5 text-[14px] font-semibold leading-5 tracking-[0.2px]">
            <Key className="w-4 h-4 text-brand" strokeWidth={1.5} />
            {t.credentialsPanel.passwordLabel}
          </label>
          <div className="relative">
            <input
              className={`input-base pr-12 text-[14px] font-medium leading-5 ${
                fieldErrors.password
                  ? 'input-error'
                  : password
                  ? 'input-valid'
                  : 'input-brand'
              }`}
              type={showPassword ? "text" : "password"}
              placeholder={t.credentialsPanel.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="icon-button-inline" onClick={() => setShowPassword((v) => !v)}>
              {showPassword ? <EyeOff className="w-5 h-5" strokeWidth={1.5} /> : <Eye className="w-5 h-5" strokeWidth={1.5} />}
            </button>
          </div>
          {fieldErrors.password && (
            <div className="field-error-text" style={{ fontSize: '12px', lineHeight: '16px' }}>
              <AlertCircle className="w-3 h-3" strokeWidth={1.5} />
              {fieldErrors.password}
            </div>
          )}
        </div>
      )}

      {showUUIDInput && (
        <div className="space-y-2">
          <label className="text-neutral-strong flex items-center gap-2.5 text-[14px] font-semibold leading-5 tracking-[0.2px]">
            <Key className="w-4 h-4 text-brand" strokeWidth={1.5} />
            {t.credentialsPanel.uuidLabel}
          </label>
          <div className="relative">
            <input
              className={`input-base pr-12 text-[14px] font-medium leading-5 ${
                fieldErrors.uuid
                  ? 'input-error'
                  : uuid
                  ? 'input-valid'
                  : 'input-brand'
              }`}
              type={showUUID ? "text" : "password"}
              placeholder={t.credentialsPanel.uuidPlaceholder}
              value={uuid}
              onChange={(e) => setUuid(e.target.value)}
            />
            <button type="button" className="icon-button-inline" onClick={() => setShowUUID((v) => !v)}>
              {showUUID ? <EyeOff className="w-5 h-5" strokeWidth={1.5} /> : <Eye className="w-5 h-5" strokeWidth={1.5} />}
            </button>
          </div>
          {fieldErrors.uuid && (
            <div className="field-error-text" style={{ fontSize: '12px', lineHeight: '16px' }}>
              <AlertCircle className="w-3 h-3" strokeWidth={1.5} />
              {fieldErrors.uuid}
            </div>
          )}
        </div>
      )}

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
