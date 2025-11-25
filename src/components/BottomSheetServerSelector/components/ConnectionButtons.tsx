import React from "react";
import { useTranslations } from "../../../hooks/useTranslations";
import type { UnifiedVpnState } from "../../../hooks/useUnifiedVpn";

interface ConnectionButtonsProps {
  vpn: UnifiedVpnState;
  onConnection: () => void;
  autoConnect?: {
    running: boolean;
    startAutoConnect: (options: { prioritizePrimary: boolean }) => void;
    cancelTest: () => void;
  };
  compact?: boolean;
}

// Abre el diálogo de logs nativos de DTunnel
function openNativeLogs() {
  try {
    if (typeof window !== 'undefined' && window.DtShowLoggerDialog) {
      window.DtShowLoggerDialog.execute();
    }
  } catch (error) {
    console.error('Error al abrir logs nativos:', error);
  }
}

// Configuración de estilos por estado
const BUTTON_STYLES: Record<string, { bg: string; text: string; pulse?: boolean; style?: React.CSSProperties }> = {
  CONNECTED: { bg: "bg-danger hover:bg-danger/90", text: "text-white" },
  CONNECTING: { bg: "bg-orange-500 hover:bg-orange-600", text: "text-white" },
  AUTH: { bg: "bg-orange-500 hover:bg-orange-600", text: "text-white" },
  STOPPING: { bg: "bg-warn hover:bg-warn/90", text: "text-white", pulse: true },
  AUTH_FAILED: { bg: "bg-brand hover:bg-primary-700", text: "text-white" },
  NO_NETWORK: { bg: "bg-brand hover:bg-primary-700", text: "text-white" },
  DISCONNECTED: { bg: "hover:opacity-90", text: "text-white", style: { backgroundColor: '#5F49F2' } },
};

// Clases base para botones
const getBaseButtonClasses = (compact: boolean, isMainButton: boolean = false) => {
  const baseSize = compact ? 'h-10' : 'h-11';
  const borderRadius = compact ? 'rounded-lg' : 'rounded-xl';
  const width = isMainButton ? 'flex-1' : (compact ? 'w-12' : 'w-14');
  
  return `no-swipe font-semibold tracking-wide touch-manipulation transition-all duration-200 ${baseSize} ${borderRadius} ${width} flex items-center justify-center shadow-elevated active:scale-[0.98] disabled:opacity-50`;
};

function ConnectionButtonsComponent({ vpn, onConnection, autoConnect, compact = false }: ConnectionButtonsProps) {
  const { t } = useTranslations();
  const isDisabled = false;

  // Obtener etiqueta según estado
  const labelMap = t.bottomSheetServerSelector.connectionButtons.vpnStates;
  const label = (() => {
    const stateLabels: Record<string, string> = {
      CONNECTED: labelMap.connected,
      CONNECTING: labelMap.connecting,
      AUTH: labelMap.auth,
      STOPPING: labelMap.stopping,
      AUTH_FAILED: labelMap.authFailed,
      NO_NETWORK: labelMap.noNetwork,
      DISCONNECTED: labelMap.disconnected,
    };
    return stateLabels[vpn.state] || labelMap.disconnected;
  })();

  const style = BUTTON_STYLES[vpn.state] || BUTTON_STYLES.DISCONNECTED;
  const buttonGap = compact ? 'gap-2.5' : 'gap-3';
  const textSize = compact ? 'text-[0.7rem]' : '';

  return (
    <div className={`flex ${buttonGap}`}>
      {/* Botón principal de conexión */}
      <button
        className={`${getBaseButtonClasses(compact, true)} ${buttonGap} ${style.bg} ${style.text} ${style.pulse ? 'animate-pulse' : ''} ${compact ? 'text-[0.78rem]' : 'text-btn'}`}
        style={style.style}
        onClick={onConnection}
        disabled={isDisabled}
        aria-label={label}
        title={`Estado actual: ${vpn.state}`}
        data-tutorial="connection-button"
      >
        <div className={`relative z-10 flex items-center justify-center ${buttonGap}`}>
          <span className={`font-semibold -tracking-[0.02em] ${textSize}`}>{label}</span>
        </div>
      </button>

      {/* Botón de logs */}
      <button
        className={`${getBaseButtonClasses(compact)} bg-slate-600 hover:bg-slate-500 text-white`}
        onClick={openNativeLogs}
        disabled={isDisabled}
        title={t.bottomSheetServerSelector.connectionButtons.logsTooltip}
        aria-label={t.bottomSheetServerSelector.connectionButtons.logsButton}
        data-tutorial="logs-button"
      >
        <span className="text-xs font-semibold">{t.bottomSheetServerSelector.connectionButtons.logsButton}</span>
      </button>

      {/* Botón de autoconexión */}
      {autoConnect && (
        <button
          className={`${getBaseButtonClasses(compact)} text-white ${
            autoConnect.running
              ? 'bg-warn hover:bg-warn/90 animate-pulse'
              : 'bg-brand hover:bg-primary-700'
          }`}
          onClick={() => {
            autoConnect.running ? autoConnect.cancelTest() : autoConnect.startAutoConnect({ prioritizePrimary: true });
          }}
          disabled={isDisabled || vpn.isConnected}
          title={autoConnect.running ? 'Detener autoconexión' : 'Iniciar autoconexión'}
          data-tutorial="quick-connect"
        >
          {autoConnect.running ? (
            <div className="spinner-sm" />
          ) : (
            <span className="text-xs font-semibold">Auto</span>
          )}
        </button>
      )}
    </div>
  );
}

export const ConnectionButtons = React.memo(ConnectionButtonsComponent);
