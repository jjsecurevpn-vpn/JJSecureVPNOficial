import { useVpn } from '../context/VpnContext';

export function Hero() {
  const { status, config } = useVpn();

  let iconClass = 'fa fa-lock-open';
  let iconState: 'connected' | 'default' = 'default';
  let text = 'Estás desconectado';

  if (status === 'CONNECTED') {
    iconClass = 'fa fa-lock';
    iconState = 'connected';
    text = 'CONECTADO';
  } else if (status === 'CONNECTING') {
    iconClass = 'fa fa-spinner fa-spin';
    text = config?.name ? `Conectando a ${config.name}…` : 'Estableciendo conexión…';
  }

  return (
    <div className="hero">
      <i className={`${iconClass} ${iconState === 'connected' ? 'hero-lock--connected' : ''}`.trim()} />
      <div className="title">{text}</div>
    </div>
  );
}
