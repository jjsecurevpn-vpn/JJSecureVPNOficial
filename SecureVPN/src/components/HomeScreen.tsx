import { useVpn } from '../context/VpnContext';
import { useSafeArea } from '../hooks/useSafeArea';
import { DOWNLOAD_URL_APK, DOWNLOAD_URL_SITE, UPDATE_TITLE } from '../constants';
import { LocationCard } from './LocationCard';
import { CredentialFields } from './ui/CredentialFields';
import { Toggle } from './ui/Toggle';
import { Button } from './ui/Button';
import { ConnectedInfo } from './ConnectedInfo';

interface HomeScreenProps {
  onShowToast: (msg: string) => void;
  autoMode: boolean;
  onAutoModeChange: (on: boolean) => void;
}

export function HomeScreen({ onShowToast, autoMode, onAutoModeChange }: HomeScreenProps) {
  const {
    status,
    config,
    creds,
    setCreds,
    setScreen,
    connect,
    disconnect,
    cancelConnecting,
    startAutoConnect,
    auto,
    needsUpdate,
  } = useVpn();
  const { statusBarHeight, navigationBarHeight } = useSafeArea();
  const sectionStyle = {
    paddingTop: `calc(${statusBarHeight}px + 16px)`,
    paddingBottom: `calc(${navigationBarHeight}px + 24px)`,
  };

  // Considerar auto.on como "conectando" también
  const isDisconnected = status === 'DISCONNECTED' && !auto.on;
  const isConnecting = status === 'CONNECTING' || auto.on;
  const isConnected = status === 'CONNECTED';

  // Determinar qué campos mostrar
  const isV2Ray = (config?.mode || '').toLowerCase().includes('v2ray');
  const hasEmbeddedAuth = !!(config?.auth?.username || config?.auth?.password || config?.auth?.uuid);
  const showUserPass = !hasEmbeddedAuth && !isV2Ray && isDisconnected;
  const showUuid = !hasEmbeddedAuth && isV2Ray && isDisconnected;

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
      return;
    }
    if (isConnecting) {
      cancelConnecting();
      onShowToast('Conexión cancelada');
      return;
    }
    // Validar
    if (!config) {
      onShowToast('Selecciona un servidor');
      return;
    }
    if (!hasEmbeddedAuth) {
      if (isV2Ray && !creds.uuid.trim()) {
        onShowToast('Ingresa el UUID');
        return;
      }
      if (!isV2Ray && (!creds.user.trim() || !creds.pass.trim())) {
        onShowToast('Ingresa usuario y contraseña');
        return;
      }
    }
    if (autoMode) {
      startAutoConnect();
    } else {
      connect();
    }
  };

  const handleServerClick = () => {
    if (!isDisconnected) {
      onShowToast('Detén la conexión para cambiar de servidor');
      return;
    }
    setScreen('servers');
  };

  const handleUpdate = () => {
    const targetUrl = needsUpdate ? DOWNLOAD_URL_APK : DOWNLOAD_URL_SITE;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    onShowToast(needsUpdate ? UPDATE_TITLE : 'Visita la tienda para verificar actualizaciones');
  };

  const handleLogs = () => {
    setScreen('logs');
  };

  const buttonText = isConnected ? 'DESCONECTAR' : isConnecting ? 'PARAR' : 'CONECTAR';

  return (
    <section className="screen" style={sectionStyle}>
      <div className="logo-container">
        <img src="https://i.ibb.co/nMHrd6V4/Secure-VPN.png" alt="Secure" className="logo clickable" />
      </div>

      <div className="center">
        <div className="muted">
          {isConnected ? 'Conectado' : isConnecting ? 'Conectando...' : 'Desconectado'}
        </div>
      </div>

      <div className="server-card">
        {needsUpdate && (
          <div className="info-card" style={{ marginBottom: 12 }}>
            <strong>{UPDATE_TITLE}</strong>
            <p className="muted" style={{ marginTop: 4 }}>
              Descarga la última versión para que la app funcione correctamente.
            </p>
          </div>
        )}

        <LocationCard 
          config={config} 
          onClick={handleServerClick}
          disabled={!isDisconnected}
        />

        {isDisconnected && (
          <CredentialFields
            username={creds.user}
            password={creds.pass}
            uuid={creds.uuid}
            showUserPass={showUserPass}
            showUuid={showUuid}
            onUsernameChange={(v) => setCreds({ user: v })}
            onPasswordChange={(v) => setCreds({ pass: v })}
            onUuidChange={(v) => setCreds({ uuid: v })}
          />
        )}

        {isConnected && <ConnectedInfo />}

        <div className="row connect-row">
          <Button variant="primary" onClick={handleConnect}>
            {buttonText}
          </Button>
          <Toggle
            checked={autoMode}
            onChange={onAutoModeChange}
            label="Auto"
          />
        </div>

        <div className="quick-grid">
          <Button variant="quick" onClick={handleUpdate}>
            <i className="fa fa-rotate" />Actualizar
          </Button>
          <Button variant="quick" onClick={handleLogs}>
            <i className="fa fa-terminal" />Registros
          </Button>
        </div>
      </div>
    </section>
  );
}
