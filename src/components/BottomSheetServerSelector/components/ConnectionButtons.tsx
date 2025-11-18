import { Zap, FileText } from "lucide-react";
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

// Iconos de estado SVG según el estado de conexión
const STATUS_ICONS = {
  retry: "M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z",
  cancel: "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",
  connected: "M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.58L10,14.17L16.59,7.58L18,9L10,17Z",
  disconnected: "M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10.1V11.1C15.4,11.4 16,12 16,12.8V16.2C16,17.1 15.1,18 14.2,18H9.8C8.9,18 8,17.1 8,16.2V12.8C8,12 8.6,11.4 9.2,11.1V10.1C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10.1V11.1H13.5V10.1C13.5,8.7 12.8,8.2 12,8.2Z",
};

function StatusIcon({ state, connected }: { state: string; connected: boolean }) {
  const iconSize = 20;
  const svgProps = {
    fill: "currentColor",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    style: { width: iconSize, height: iconSize },
  };

  if (state === 'STOPPING') {
    return <div className="spinner-sm" />;
  }

  const getIconPath = () => {
    if (state === 'AUTH_FAILED' || state === 'NO_NETWORK') return STATUS_ICONS.retry;
    if (state === 'CONNECTING' || state === 'AUTH') return STATUS_ICONS.cancel;
    return connected ? STATUS_ICONS.connected : STATUS_ICONS.disconnected;
  };

  return <svg {...svgProps}><path d={getIconPath()} /></svg>;
}

// Configuración de estilos por estado
const BUTTON_STYLES: Record<string, { bg: string; text: string; pulse?: boolean }> = {
  CONNECTED: { bg: "bg-danger hover:bg-danger/90", text: "text-white" },
  CONNECTING: { bg: "bg-orange-500 hover:bg-orange-600", text: "text-white" },
  AUTH: { bg: "bg-orange-500 hover:bg-orange-600", text: "text-white" },
  STOPPING: { bg: "bg-warn hover:bg-warn/90", text: "text-white", pulse: true },
  AUTH_FAILED: { bg: "bg-brand hover:bg-primary-700", text: "text-white" },
  NO_NETWORK: { bg: "bg-brand hover:bg-primary-700", text: "text-white" },
  DISCONNECTED: { bg: "bg-success hover:bg-success-strong", text: "text-white" },
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
  const iconSize = compact ? 18 : 20;
  const buttonGap = compact ? 'gap-2.5' : 'gap-3';
  const textSize = compact ? 'text-[0.7rem]' : '';

  return (
    <div className={`flex ${buttonGap}`}>
      {/* Botón principal de conexión */}
      <button
        className={`${getBaseButtonClasses(compact, true)} ${buttonGap} ${style.bg} ${style.text} ${style.pulse ? 'animate-pulse' : ''} ${compact ? 'text-[0.78rem]' : 'text-btn'}`}
        onClick={onConnection}
        disabled={isDisabled}
        aria-label={label}
        title={`Estado actual: ${vpn.state}`}
        data-tutorial="connection-button"
      >
        <div className={`relative z-10 flex items-center justify-center ${buttonGap}`}>
          <div className="transition-all duration-300 scale-95">
            <StatusIcon state={vpn.state} connected={vpn.isConnected} />
          </div>
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
        <FileText size={iconSize} className="text-white" strokeWidth={1.5} />
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
            <Zap size={iconSize} className="text-white" strokeWidth={1.5} />
          )}
        </button>
      )}
    </div>
  );
}

export const ConnectionButtons = React.memo(ConnectionButtonsComponent);
