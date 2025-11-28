import type { ServerConfig } from '../types';

interface LocationCardProps {
  config: ServerConfig | null;
  onClick: () => void;
  disabled?: boolean;
}

export function LocationCard({ config, onClick, disabled }: LocationCardProps) {
  const icon = config?.icon?.trim();
  const isImg = !!icon && (/^(https?:)?\/\//i.test(icon) || icon.startsWith('data:'));

  return (
    <div 
      className="location-card" 
      onClick={disabled ? undefined : onClick}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1 }}
      title="Elegir servidor"
    >
      <div className="loc-left">
        <div className="flag">
          {isImg && icon ? (
            <img src={icon} alt={config?.name || 'Servidor'} />
          ) : (
            icon || '🌐'
          )}
        </div>
        <div>
          <div className="loc-name">
            {config?.name || 'Elige un servidor'}
          </div>
          {config?.description && (
            <div className="loc-ip">{config.description}</div>
          )}
        </div>
      </div>
      <i className="fa fa-chevron-right" aria-hidden="true" />
    </div>
  );
}
