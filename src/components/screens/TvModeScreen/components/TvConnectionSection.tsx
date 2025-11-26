import React from 'react';
import { useTranslations } from '../../../../hooks/useTranslations';
import { ResponsiveConnectionButton } from './ResponsiveConnectionButton';
import { ResponsiveLogsButton } from './ResponsiveLogsButton';
import { StepSection } from './StepSection';
import type { ConfigItem } from '../../../../types/config';

interface TvConnectionSectionProps {
  headerSize: 'small' | 'medium' | 'large';
  compact: boolean;
  padding: number;
  spacing: number;
  fontSize: 'small' | 'base' | 'large';
  contentJustifyClass: string;
  activeConfig: ConfigItem | null;
  formError: string | null;
  vpn: Record<string, unknown>;
  onConnection: () => Record<string, unknown>;
  showServerDescription: boolean;
}

export const TvConnectionSection: React.FC<TvConnectionSectionProps> = ({
  headerSize,
  compact,
  padding,
  spacing,
  fontSize,
  contentJustifyClass,
  activeConfig,
  formError,
  vpn,
  onConnection,
  showServerDescription,
}) => {
  const { t } = useTranslations();

  const getFontSizeClass = () => {
    if (fontSize === 'small') return 'text-xs';
    if (fontSize === 'large') return 'text-base';
    return 'text-sm';
  };

  return (
    <StepSection
      title={t.tvMode?.steps?.connection || 'CONEXIÓN'}
      headerSize={headerSize}
      compact={compact}
      padding={padding}
      scrollable={false}
    >
      <div className={`flex flex-col items-center ${contentJustifyClass} h-full`}>
        {showServerDescription && activeConfig?.description && (
          <p
            className={`text-neutral-text max-w-sm leading-relaxed text-center ${getFontSizeClass()}`}
            style={{ marginBottom: spacing }}
          >
            {activeConfig.description}
          </p>
        )}
        {formError && (
          <div
            className={`rounded-lg bg-red-600/90 text-white font-medium max-w-sm text-center text-xs`}
            style={{ marginBottom: spacing, padding: '0.375rem 0.75rem' }}
          >
            {formError}
          </div>
        )}
        <div
          className="flex flex-col items-center justify-center"
          style={{ gap: spacing }}
        >
          <ResponsiveConnectionButton vpn={vpn} onConnection={onConnection} size={headerSize} compact={compact} />
          <ResponsiveLogsButton size={headerSize} compact={compact} />
        </div>
      </div>
    </StepSection>
  );
};
