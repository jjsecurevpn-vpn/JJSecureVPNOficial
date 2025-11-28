import { useVpn } from '../context/VpnContext';
import { Button } from './ui/Button';

export function ConnectedInfo() {
  const { status, user, creds, config, setScreen } = useVpn();

  if (status !== 'CONNECTED') return null;

  const name = user?.name || config?.auth?.username || creds.user || 'usuario';

  return (
    <div className="info-card compact-info">
      <div>
        <span className="summary-eyebrow">Sesión activa</span>
        <h3>Hola, {name}</h3>
        <p className="summary-meta">Tu conexión está protegida. Consulta los datos de tu cuenta cuando lo necesites.</p>
      </div>
      <Button
        variant="soft"
        className="full-width"
        onClick={() => setScreen('account')}
      >
        <i className="fa fa-user-shield" aria-hidden="true" /> Ver detalles
      </Button>
    </div>
  );
}
