import React from 'react';
import { useTranslations } from '../../../../hooks/useTranslations';
import { TvCredentialsPanel } from './TvCredentialsPanel';
import { StepSection } from './StepSection';

interface TvCredentialsSectionProps {
  headerSize: 'small' | 'medium' | 'large';
  compact: boolean;
  padding: number;
  highlightStep1: boolean;
}

export const TvCredentialsSection: React.FC<TvCredentialsSectionProps> = ({
  headerSize,
  compact,
  padding,
  highlightStep1,
}) => {
  const { t } = useTranslations();

  return (
    <StepSection
      title={t.tvMode?.steps?.credentials || 'PONER CREDENCIALES'}
      headerSize={headerSize}
      compact={compact}
      padding={padding}
      scrollable={false}
      className={`${highlightStep1 ? 'ring-2 ring-emerald-400/70 shadow-[0_0_0_1px_rgba(72,231,164,0.45)] animate-pulse' : ''}`}
    >
      <TvCredentialsPanel compact={compact} />
    </StepSection>
  );
};
