/**
 * @file StatusIndicator.tsx
 * @description Componente para mostrar indicadores de estado con punto de color y texto
 */

import { Text } from './Text';
import { colors } from '../../constants/theme';

export interface StatusIndicatorProps {
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  label?: string;
  size?: 'small' | 'medium';
}

export function StatusIndicator({ 
  status, 
  label,
  size = 'medium' 
}: StatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          color: colors.status.success,
          defaultLabel: 'Conectado'
        };
      case 'connecting':
        return {
          color: colors.brand.soft,
          defaultLabel: 'Conectando...'
        };
      case 'error':
        return {
          color: colors.status.error,
          defaultLabel: 'Error'
        };
      case 'disconnected':
      default:
        return {
          color: colors.brand.soft,
          defaultLabel: 'Desconectado'
        };
    }
  };

  const config = getStatusConfig();
  const displayLabel = label || config.defaultLabel;
  
  const dotSize = size === 'small' ? 'w-1.5 h-1.5' : 'w-2 h-2';
  const textSize = size === 'small' ? 'bodySmall' : 'body';

  return (
    <div className="flex items-center gap-1.5">
      <div 
        className={`${dotSize} rounded-full`}
        style={{ backgroundColor: config.color }}
      />
      <Text 
        variant={textSize} 
        style={{ color: config.color }}
        className="font-medium tracking-wide"
      >
        {displayLabel}
      </Text>
    </div>
  );
}
