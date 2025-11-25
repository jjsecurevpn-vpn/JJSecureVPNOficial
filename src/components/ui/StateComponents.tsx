/**
 * @file StateComponents.tsx
 * @description Componentes reutilizables para estados de carga, error y empty
 */

import React from 'react';
import { AlertTriangle, RefreshCw, Shield } from 'lucide-react';
import { Spinner } from './Spinner';
import { WhatsAppIcon } from '../BasicIcons';
import { Button, Text, Card } from './';
import { colors } from '../../constants/theme';

// Componente de estado de carga
export interface LoadingStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export function LoadingState({ 
  title = "Cargando",
  description = "Por favor espera...",
  icon = <Shield className="w-6 h-6" style={{ color: colors.brand.primary }} strokeWidth={1.5} />,
  size = 'medium'
}: LoadingStateProps) {
  const sizeClasses = {
    small: 'h-32',
    medium: 'h-64', 
    large: 'h-96'
  };
  
  return (
    <div className={`flex flex-col items-center justify-center ${sizeClasses[size]} space-y-4`}>
      <div className="relative">
  <Spinner size={size === 'large' ? 'xl' : size === 'medium' ? 'lg' : 'md'} color="brand" thickness="thick" />
        <div className="absolute inset-0 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="text-center">
        <Text variant="h3" color="primary" className="mb-1">
          {title}
        </Text>
        <Text variant="body" color="tertiary">
          {description}
        </Text>
      </div>
    </div>
  );
}

// Componente de estado de error
export interface ErrorStateProps {
  title?: string;
  error: string;
  onRetry?: () => void;
  onContactSupport?: () => void;
  retryLabel?: string;
  supportLabel?: string;
  showActions?: boolean;
}

export function ErrorState({ 
  title = "Error de conexión",
  error,
  onRetry,
  onContactSupport,
  retryLabel = "Reintentar",
  supportLabel = "Soporte",
  showActions = true
}: ErrorStateProps) {
  return (
    <Card variant="outline" className="p-6" style={{ borderColor: `${colors.status.error}33` }}>
      <div className="flex flex-col items-center text-center space-y-4">
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center border"
          style={{ 
            backgroundColor: `${colors.status.error}10`,
            borderColor: `${colors.status.error}33`
          }}
        >
          <AlertTriangle className="w-8 h-8" style={{ color: colors.status.error }} strokeWidth={1.5} />
        </div>
        
        <div>
          <Text variant="h3" style={{ color: colors.status.error }} className="mb-2">
            {title}
          </Text>
          <Text variant="body" color="primary" className="max-w-sm leading-relaxed">
            {error}
          </Text>
        </div>

        {showActions && (onRetry || onContactSupport) && (
          <div className="flex gap-3 w-full max-w-sm">
            {onRetry && (
              <Button 
                variant="primary"
                size="medium"
                onClick={onRetry}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" strokeWidth={1.5} /> 
                {retryLabel}
              </Button>
            )}
            {onContactSupport && (
              <Button 
                variant="outline"
                size="medium"
                onClick={onContactSupport}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <WhatsAppIcon size={16} /> 
                {supportLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

// Componente de estado vacío
export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ 
  title,
  description,
  icon,
  action
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
      {icon && (
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: colors.background.tertiary }}
        >
          {icon}
        </div>
      )}
      
      <div className="space-y-6">
        <Text variant="h3" color="primary">
          {title}
        </Text>
        <div className="max-w-sm leading-relaxed space-y-2">
          {description.split('\n\n').map((paragraph, index) => (
            <Text key={index} variant="body" color="tertiary" as="p" className="leading-relaxed">
              {paragraph}
            </Text>
          ))}
        </div>
      </div>

      {action && (
        <Button 
          variant="primary"
          size="medium"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
