/**
 * @file SettingsCard.tsx
 * @description Componente reutilizable para tarjetas de configuración
 */

import { Card } from './Card';
import { Text } from './Text';
import { colors } from '../../constants/theme';

interface SettingsCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsCard({ title, children, className = '' }: SettingsCardProps) {
  return (
    <div className={`px-4 ${className}`}>
      <div className="py-3">
        <Text 
          variant="label" 
          color="brand" 
          as="h2"
          className="uppercase tracking-wide"
          style={{ letterSpacing: '0.4px' }}
        >
          {title}
        </Text>
      </div>
      <Card 
        variant="default" 
        padding="md"
        className="border overflow-hidden rounded-xl"
        style={{ 
          borderColor: colors.border.primary,
          padding: '8px',
          boxShadow: 'none'
        }}
      >
        {children}
      </Card>
    </div>
  );
}
