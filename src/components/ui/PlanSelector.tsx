/**
 * @file PlanSelector.tsx
 * @description Componente reutilizable para seleccionar planes
 */

import { Text } from './Text';
import { colors, shadows, borderRadius, spacing } from '../../constants/theme';

export interface PlanItem {
  id: string | number;
  title: string;
  subtitle?: string;
  price: string;
  priceUnit?: string;
  secondaryPrice?: string;
  badge?: string;
  isPopular?: boolean;
  savingsText?: string; // Texto de ahorro / descuento calculado
  description?: string; // Descripción corta opcional
  highlight?: boolean;  // Forzar estilo destacado adicional
}

export interface PlanSelectorProps<T extends PlanItem> {
  plans: T[];
  selectedIndex: number;
  onPlanSelect: (index: number) => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function PlanSelector<T extends PlanItem>({
  plans,
  selectedIndex,
  onPlanSelect,
  title,
  subtitle,
  className = '',
}: PlanSelectorProps<T>) {
  return (
    <div className={`space-y-8 ${className}`}>
      {(title || subtitle) && (
        <div className="text-center" style={{ marginBottom: spacing['3xl'] }}>
          {title && (
            <Text variant="h2" color="primary" as="h2" className="mb-3">
              {title}
            </Text>
          )}
          {subtitle && (
            <Text variant="body" color="tertiary" as="p">
              {subtitle}
            </Text>
          )}
        </div>
      )}

      {/* Lista de planes */}
      <div className="space-y-3">
        {plans.map((plan, index) => {
          const selected = index === selectedIndex;
          return (
            <button
              key={plan.id || index}
              onClick={() => onPlanSelect(index)}
              className="w-full flex items-center justify-between text-left transition-all duration-200"
              style={{
                backgroundColor: selected ? colors.background.tertiary : colors.background.secondary,
                border: selected ? `1px solid ${colors.brand.primary}` : `1px solid ${colors.border.primary}`,
                borderRadius: borderRadius.md,
                padding: spacing.lg,
                boxShadow: selected ? shadows.ring : shadows.card,
                outline: 'none'
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = selected 
                  ? shadows.ringFocus
                  : `${shadows.card}, ${shadows.focus}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = selected 
                  ? shadows.ring
                  : shadows.card;
              }}
            >
              {/* Izquierda: título, badge y descripción */}
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Text variant="bodyLarge" color="primary" className="font-semibold">
                      {plan.title}
                    </Text>
                    {(plan.badge || plan.isPopular) && (
                      <span className={plan.isPopular ? 'badge-soft-brand font-semibold' : 'badge-outline-brand'}>
                        {plan.badge || (plan.isPopular ? 'Popular' : '')}
                      </span>
                    )}
                  </div>
                  {plan.subtitle && (
                    <Text variant="bodySmall" color="accent" className="font-medium">
                      {plan.subtitle}
                    </Text>
                  )}
                  {plan.description && (
                    <Text variant="caption" color="tertiary" className="mt-1" style={{maxWidth:'150px'}}>
                      {plan.description}
                    </Text>
                  )}
                  {plan.savingsText && (
                    <Text variant="caption" color="accent" className="mt-1 font-medium">
                      {plan.savingsText}
                    </Text>
                  )}
                </div>
              </div>
              
              {/* Derecha: precios */}
              <div className="text-right leading-tight flex flex-col items-end gap-0.5">
                <div className="flex items-baseline justify-end gap-1">
                  <Text variant="bodyLarge" color="primary" className="font-semibold">
                    {plan.price}
                  </Text>
                  {plan.priceUnit && (
                    <Text variant="bodyLarge" color="primary" className="font-semibold">
                      {plan.priceUnit}
                    </Text>
                  )}
                </div>
                {plan.secondaryPrice && (
                  <Text variant="caption" color="tertiary">
                    {plan.secondaryPrice}
                  </Text>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
