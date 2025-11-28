import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { nativeAPI } from '../../../../utils';
import { useTranslations } from '../../../../hooks/useTranslations';
import { Eye, EyeOff } from 'lucide-react';
import { InputField } from './InputField';

export const TvCredentialsPanel: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const [visibility, setVisibility] = useState<{ password: boolean; uuid: boolean }>({ password: false, uuid: false });
  const [fields, setFields] = useState({ username: '', password: '', uuid: '', hysteriaUser: '', hysteriaPass: '' });
  const { t } = useTranslations();

  const activeConfig = useMemo(() => nativeAPI.config.getActive(), []);
  const mode = activeConfig?.mode?.toLowerCase() || '';
  const serverName = activeConfig?.name?.toLowerCase() || '';
  const serverDescription = activeConfig?.description?.toLowerCase() || '';
  const isHysteria = mode.includes('hysteria');
  const isV2Ray = mode.startsWith('v2ray');
  const showUUIDInput = isV2Ray && !activeConfig?.auth?.v2ray_uuid;
  
  // Detectar si es "Hysteria Gratuito" específicamente
  const isHysteriaGratuito = isHysteria && (
    serverName.includes('gratuito') || 
    serverName.includes('free') ||
    serverDescription.includes('gratuito') ||
    serverDescription.includes('free')
  );
  
  // Placeholders especiales para Hysteria Gratuito
  const usernamePlaceholder = isHysteriaGratuito 
    ? 'Usuario: secure' 
    : (t.credentialsPanel?.usernamePlaceholder || 'Usuario');
  const passwordPlaceholder = isHysteriaGratuito 
    ? 'Clave: secure' 
    : (t.credentialsPanel?.passwordPlaceholder || 'Contraseña');

  useEffect(() => {
    const u = nativeAPI.auth.getUsername() || '';
    const p = nativeAPI.auth.getPassword() || '';
    const uuid = nativeAPI.auth.getUUID() || '';
    
    // Si es Hysteria Gratuito, pre-llenar con "secure"
    if (isHysteriaGratuito) {
      setFields(f => ({ ...f, username: 'secure', password: 'secure', uuid }));
      // También guardar en nativeAPI para que esté listo
      nativeAPI.auth.setUsername('secure:secure');
      nativeAPI.auth.setPassword('secure:secure');
    } else if (isHysteria) {
      // Hysteria normal: limpiar si tenía "secure" del servidor anterior
      const cleanU = u === 'secure:secure' ? '' : u;
      const cleanP = p === 'secure:secure' ? '' : p;
      const source = cleanU.includes(':') ? cleanU : cleanP;
      if (source.includes(':')) {
        const [hu, hp] = source.split(':', 2);
        setFields(f => ({ ...f, username: hu || '', password: hp || '', uuid }));
      } else {
        setFields(f => ({ ...f, username: cleanU, password: cleanP, uuid }));
      }
    } else {
      // Otros servidores: limpiar si tenía "secure" del servidor anterior
      const cleanU = (u === 'secure:secure' || u === 'secure') ? '' : u;
      const cleanP = (p === 'secure:secure' || p === 'secure') ? '' : p;
      setFields(f => ({ ...f, username: cleanU, password: cleanP, uuid }));
      // Limpiar también en nativeAPI si tenía secure
      if (u === 'secure:secure' || u === 'secure') {
        nativeAPI.auth.setUsername('');
      }
      if (p === 'secure:secure' || p === 'secure') {
        nativeAPI.auth.setPassword('');
      }
    }
  }, [isHysteria, isHysteriaGratuito]);

  const persist = useCallback((draft: Partial<typeof fields>) => {
    setFields(f => {
      const next = { ...f, ...draft };
      if (isHysteria) {
        // Hysteria: combinar user:pass usando los inputs normales
        const combined = `${next.username.trim()}:${next.password.trim()}`;
        if (combined !== ':') {
          nativeAPI.auth.setUsername(combined);
          nativeAPI.auth.setPassword(combined);
        }
      } else {
        nativeAPI.auth.setUsername(next.username);
        nativeAPI.auth.setPassword(next.password);
      }
      if (showUUIDInput) nativeAPI.auth.setUUID(next.uuid);
      return next;
    });
  }, [isHysteria, showUUIDInput]);

  const sizeConfig = (() => {
    // HD-specific optimization
    const isHD = typeof window !== 'undefined' && window.innerWidth >= 1280 && window.innerWidth <= 1400 && window.innerHeight <= 800;
    const isTv = typeof window !== 'undefined' && window.innerWidth >= 1024;
    
    if (isHD || isTv) {
      return {
        spacing: 'space-y-2', padding: 'px-2 py-1.5', textSize: 'text-xs', borderRadius: 'rounded-md', iconSize: 14, buttonPadding: 'p-0',
        icons: { eye: <Eye size={14} />, eyeOff: <EyeOff size={14} /> }
      };
    } else if (compact) {
      return {
        spacing: 'space-y-3', padding: 'px-3 py-2', textSize: 'text-sm', borderRadius: 'rounded-lg', iconSize: 16, buttonPadding: 'p-0.5',
        icons: { eye: <Eye size={16} />, eyeOff: <EyeOff size={16} /> }
      };
    } else {
      return {
        spacing: 'space-y-6', padding: 'px-4 py-3', textSize: 'text-base', borderRadius: 'rounded-xl', iconSize: 20, buttonPadding: 'p-1',
        icons: { eye: <Eye size={20} />, eyeOff: <EyeOff size={20} /> }
      };
    }
  })();

  return (
    <div className={sizeConfig.spacing}>
      {/* Siempre mostramos inputs normales (username/password) */}
      <InputField
        placeholder={usernamePlaceholder}
        value={fields.username}
        onChange={(v) => persist({ username: v })}
        sizeConfig={sizeConfig}
        compact={compact}
      />
      <InputField
        placeholder={passwordPlaceholder}
        type="password"
        value={fields.password}
        onChange={(v) => persist({ password: v })}
        showToggle
        shown={visibility.password}
        onToggle={() => setVisibility(v => ({ ...v, password: !v.password }))}
        sizeConfig={sizeConfig}
        compact={compact}
      />
      {showUUIDInput && (
        <InputField
          placeholder={t.credentialsPanel?.uuidPlaceholder || 'UUID'}
            type="password"
            value={fields.uuid}
            onChange={(v) => persist({ uuid: v })}
            showToggle
            shown={visibility.uuid}
            onToggle={() => setVisibility(v => ({ ...v, uuid: !v.uuid }))}
            sizeConfig={sizeConfig}
            compact={compact}
            mono
        />
      )}
    </div>
  );
};
