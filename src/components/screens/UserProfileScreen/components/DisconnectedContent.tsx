/**
 * @file DisconnectedContent.tsx
 * @description Contenido mostrado cuando el usuario no está conectado
 */

import { Settings, CheckCircle2, ArrowRight, Server, AlertTriangle } from "lucide-react";
import { InfoPanel, Card } from "../../../ui";
import { CredentialsPanel } from "../../../user/CredentialsPanel";
import { nativeAPI } from "../../../../utils";
import { useActiveConfig } from "../../../../context/ActiveConfigContext";
import { colors } from "../../../../constants/theme";
import { useTranslations } from "../../../../context/LanguageContext";

interface DisconnectedContentProps {
  isConnecting: boolean;
}

export function DisconnectedContent({ isConnecting }: DisconnectedContentProps) {
  const t = useTranslations();
  const { activeConfig } = useActiveConfig();

  // Evaluamos si realmente hace falta mostrar inputs
  const needsUser = nativeAPI.auth.shouldShowInput('username');
  const needsPass = nativeAPI.auth.shouldShowInput('password');
  const needsUuid = nativeAPI.auth.shouldShowInput('uuid');
  const allPreconfigured = !needsUser && !needsPass && !needsUuid && !!activeConfig;

  return (
    <>
      {/* Panel de bienvenida usando InfoPanel */}
      <InfoPanel
        title={t.userProfileScreen.disconnectedContent.configureAccess}
        subtitle={t.userProfileScreen.disconnectedContent.configureAccessDesc}
        icon={<Settings className="w-6 h-6" strokeWidth={1.5} />}
        variant="info"
      >
        <div 
          className="rounded-xl p-4 border"
          style={{
            backgroundColor: `${colors.brand.primary}10`,
            borderColor: `${colors.brand.primary}20`
          }}
        >
          <div className="flex items-start gap-3">
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: `${colors.brand.primary}20` }}
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colors.brand.soft }}
              />
            </div>
            <div style={{ color: colors.brand.soft }}>
              <p className="mb-1 text-sm font-medium">
                {t.userProfileScreen.disconnectedContent.secureConnection}
              </p>
              <p className="text-xs opacity-80 leading-relaxed">
                {t.userProfileScreen.disconnectedContent.secureConnectionDesc}
              </p>
            </div>
          </div>
        </div>
      </InfoPanel>

      {allPreconfigured ? (
        <Card
          className="p-6 overflow-hidden"
          style={{
            background: `linear-gradient(to bottom right, ${colors.background.primary}, ${colors.background.secondary})`,
            boxShadow: 'none'
          }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-[15px] font-semibold text-white leading-5 tracking-[0.2px]">
                  {t.credentialsPanel?.preconfigured?.title || 'Conexión directa'}
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-medium uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {t.credentialsPanel?.preconfigured?.readyBadge || 'Listo'}
                </span>
              </div>
              <p className="text-neutral-text text-[12px] leading-5 mb-3">
                {t.credentialsPanel?.preconfigured?.description || 'Este servidor está configurado para conexión directa. Solo conecta cuando quieras.'}
              </p>
              {activeConfig && (
                <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-surface-border/60 border border-surface-border">
                  <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center">
                    <Server className="w-5 h-5 text-brand" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] text-neutral-text uppercase tracking-wide mb-0.5">Servidor</p>
                    <p className="text-[13px] font-medium text-white truncate max-w-[240px]">{activeConfig.name}</p>
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-3">
                <a
                  href="#home"
                  className="btn-action w-full h-11 text-[13px] font-semibold tracking-wide justify-center"
                  style={{ textDecoration: 'none' }}
                >
                  <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                  {t.credentialsPanel?.preconfigured?.actionLabel || 'Ir a Conectar'}
                </a>
                <div className="flex items-start gap-2 rounded-lg border border-amber-400/30 bg-amber-500/10 p-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" strokeWidth={1.5} />
                  <p className="text-[11px] leading-4 text-amber-200/90">
                    Este servidor podría fallar si no está habilitado o disponible. Si no conecta, prueba otro servidor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card 
          className="p-6 overflow-hidden"
          style={{
            background: `linear-gradient(to bottom right, ${colors.background.primary}, ${colors.background.secondary})`,
            boxShadow: 'none'
          }}
        >
          <CredentialsPanel isConnecting={isConnecting} />
        </Card>
      )}
    </>
  );
}
