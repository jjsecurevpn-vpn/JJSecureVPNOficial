/**
 * @file EmptyState.tsx
 * @description Componente de estado vacío
 */

import type { EmptyStateProps } from '../../../ui/StateComponents';
import { Text } from '../../../ui/Text';
import { colors } from '../../../../constants/theme';

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
        <button 
          className="px-4 py-2 rounded-lg font-medium"
          style={{
            backgroundColor: colors.brand.primary,
            color: 'white'
          }}
          onClick={action.onClick}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
