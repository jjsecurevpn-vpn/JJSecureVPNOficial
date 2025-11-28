import { useTranslations } from '../../../../hooks/useTranslations';
import { ResponsiveStatusIcon } from './ResponsiveStatusIcon';
import type { UnifiedVpnState } from '../../../../hooks/useUnifiedVpn';
import type { VpnState } from '../../../../types/vpn';

const BASE_BUTTON_STYLE = { text: 'text-white' };
const TV_BUTTON_STYLES: Record<string, { bg: string; text: string; pulse?: boolean }> = {
  CONNECTED: { ...BASE_BUTTON_STYLE, bg: 'bg-danger hover:bg-danger/90' },
  CONNECTING: { ...BASE_BUTTON_STYLE, bg: 'bg-orange-500 hover:bg-orange-600' },
  AUTH: { ...BASE_BUTTON_STYLE, bg: 'bg-orange-500 hover:bg-orange-600' },
  STOPPING: { ...BASE_BUTTON_STYLE, bg: 'bg-warn hover:bg-warn/90', pulse: true },
  AUTH_FAILED: { ...BASE_BUTTON_STYLE, bg: 'bg-brand hover:bg-primary-700' },
  NO_NETWORK: { ...BASE_BUTTON_STYLE, bg: 'bg-brand hover:bg-primary-700' },
  DISCONNECTED: { ...BASE_BUTTON_STYLE, bg: 'bg-success hover:bg-success-strong' },
};

function getVpnStateLabel(state: string, labelMap: Record<string, string>) {
  switch (state) {
    case 'CONNECTED': return labelMap.connected;
    case 'CONNECTING': return labelMap.connecting;
    case 'AUTH': return labelMap.auth;
    case 'STOPPING': return labelMap.stopping;
    case 'AUTH_FAILED': return labelMap.authFailed;
    case 'NO_NETWORK': return labelMap.noNetwork;
    case 'DISCONNECTED':
    default: return labelMap.disconnected;
  }
}

interface ResponsiveConnectionButtonProps {
  vpn: UnifiedVpnState;
  onConnection: () => void | Promise<void | VpnState | null>;
  size: 'small' | 'medium' | 'large';
  compact?: boolean;
}

export function ResponsiveConnectionButton({ vpn, onConnection, size, compact = false }: ResponsiveConnectionButtonProps) {
  const { t } = useTranslations();
  const vpnState = vpn.state || 'DISCONNECTED';
  const labelMap = t.bottomSheetServerSelector.connectionButtons.vpnStates as Record<string, string>;
  const label = getVpnStateLabel(vpnState, labelMap);
  const style = TV_BUTTON_STYLES[vpnState] || TV_BUTTON_STYLES.DISCONNECTED;
  
  // HD-specific optimization
  const isHD = typeof window !== 'undefined' && window.innerWidth >= 1280 && window.innerWidth <= 1400 && window.innerHeight <= 800;
  const isTv = typeof window !== 'undefined' && window.innerWidth >= 1024;
  
  const sizeConfig = isHD || isTv ? {
    small: { width: 'w-36', height: 'h-10', text: 'text-xs', iconSize: 16 },
    medium: { width: 'w-36', height: 'h-10', text: 'text-xs', iconSize: 16 },
    large: { width: 'w-36', height: 'h-10', text: 'text-xs', iconSize: 16 }
  }[size] : {
    small: { width: compact ? 'w-32' : 'w-40', height: compact ? 'h-10' : 'h-12', text: compact ? 'text-xs' : 'text-sm', iconSize: compact ? 16 : 18 },
    medium: { width: 'w-48', height: 'h-14', text: 'text-base', iconSize: 20 },
    large: { width: 'w-56', height: 'h-16', text: 'text-lg', iconSize: 24 }
  }[size];
  return (
    <button
      className={`no-swipe font-bold tracking-wide touch-manipulation transition-all duration-200 ${sizeConfig.width} ${sizeConfig.height} rounded-lg ${sizeConfig.text} flex flex-row items-center justify-center gap-3 shadow-xl ${style.bg} ${style.text} active:scale-95 disabled:opacity-50 ${style.pulse ? 'animate-pulse' : ''} border-2 border-white/20`}
      onClick={onConnection}
      aria-label={label}
      title={`Estado actual: ${vpnState}`}
      data-vc-focusable
    >
      <div className="transition-all duration-300">
        <ResponsiveStatusIcon state={vpnState} connected={vpn.isConnected} size={sizeConfig.iconSize} />
      </div>
      <span className="font-bold leading-tight text-center">{label}</span>
    </button>
  );
}
