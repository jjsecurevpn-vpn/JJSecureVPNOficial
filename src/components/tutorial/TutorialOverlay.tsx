import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useTutorial } from '../../context/TutorialContext';
import { ResponsiveBox, Container } from '../ui';
import { colors, shadows, borderRadius } from '../../constants/theme';
import { fontFamilies } from '../../constants/typography';

const Z_INDEX_BASE = 9999;
const SPOTLIGHT_PADDING = 6;
const HIGHLIGHT_BORDER_PADDING = 3;
const ARROW_SIZE = 10;
const TOOLTIP_DEFAULT_SIZE = { width: 300, height: 160 };
const TOOLTIP_MIN_GAP = 10;
const SCREEN_MARGIN = 20;
const TOOLTIP_MEASURE_THRESHOLD = 2;

const COMMON_BUTTON_STYLES = {
  cursor: 'pointer',
  fontFamily: fontFamilies.primary
};

const COMMON_TEXT_STYLES = {
  margin: 0,
  lineHeight: '1.5'
};

interface TooltipPositionResult { left: number; top: number; position: 'top'|'bottom'|'left'|'right'; }

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getDerivedRects = (target: DOMRect) => ({
  spotlight: {
    x: target.left - SPOTLIGHT_PADDING,
    y: target.top - SPOTLIGHT_PADDING,
    width: target.width + SPOTLIGHT_PADDING * 2,
    height: target.height + SPOTLIGHT_PADDING * 2,
    rx: 8
  },
  highlight: {
    left: target.left - HIGHLIGHT_BORDER_PADDING,
    top: target.top - HIGHLIGHT_BORDER_PADDING,
    width: target.width + HIGHLIGHT_BORDER_PADDING * 2,
    height: target.height + HIGHLIGHT_BORDER_PADDING * 2
  }
});

const ARROW_STYLES = {
  base: { position: 'absolute' as const, width: 0, height: 0 },
  transparent: `${ARROW_SIZE}px solid transparent`,
  color: `${ARROW_SIZE}px solid ${colors.background.secondary}`
};

const Arrow: React.FC<{ position: string }> = ({ position }) => {
  const arrowConfigs = {
    top: { borderLeft: ARROW_STYLES.transparent, borderRight: ARROW_STYLES.transparent, borderTop: ARROW_STYLES.color, bottom: `-${ARROW_SIZE}px`, left: '50%', transform: 'translateX(-50%)' },
    left: { borderTop: ARROW_STYLES.transparent, borderBottom: ARROW_STYLES.transparent, borderLeft: ARROW_STYLES.color, right: `-${ARROW_SIZE}px`, top: '50%', transform: 'translateY(-50%)' },
    right: { borderTop: ARROW_STYLES.transparent, borderBottom: ARROW_STYLES.transparent, borderRight: ARROW_STYLES.color, left: `-${ARROW_SIZE}px`, top: '50%', transform: 'translateY(-50%)' },
    bottom: { borderLeft: ARROW_STYLES.transparent, borderRight: ARROW_STYLES.transparent, borderBottom: ARROW_STYLES.color, top: `-${ARROW_SIZE}px`, left: '50%', transform: 'translateX(-50%)' }
  };

  return <ResponsiveBox style={{ ...ARROW_STYLES.base, ...arrowConfigs[position as keyof typeof arrowConfigs] || arrowConfigs.bottom }} />;
};

const WELCOME_STYLES = {
  overlay: { position: 'fixed' as const, inset: 0, backgroundColor: 'rgba(0,0,0,0.78)', zIndex: Z_INDEX_BASE - 1 },
  card: { borderRadius: borderRadius.lg, boxShadow: shadows.level1, border: `1px solid ${colors.border.primary}` },
  primaryButton: { background: colors.brand.primary, color: colors.text.primary, border: 'none', borderRadius: borderRadius.md, flex: 1, padding: '10px 18px', ...COMMON_BUTTON_STYLES },
  secondaryButton: { background: 'transparent', color: colors.text.tertiary, border: `1px solid ${colors.border.secondary}`, borderRadius: borderRadius.md, flex: 1, padding: '10px 18px', ...COMMON_BUTTON_STYLES }
};

const WelcomeScreen: React.FC<{ isFirstTime: boolean; handleContinue: () => void; handleStart: () => void; skip: () => void; }>=({ isFirstTime, handleContinue, handleStart, skip }) => (
  <>
    <ResponsiveBox style={WELCOME_STYLES.overlay} />
    <ResponsiveBox display="flex" style={{ position: 'fixed', inset: 0, zIndex: Z_INDEX_BASE }} alignItems="center" justifyContent="center" padding={{ xs: '16px', md: '32px' }}>
      <Container maxWidth="340px">
        <ResponsiveBox bg={colors.background.secondary} style={WELCOME_STYLES.card} padding={{ xs: '28px', md: '32px' }} display="flex" flexDirection="column" gap="20px">
          <ResponsiveBox as="h1" className="text-h1 font-semibold" style={{ color: colors.text.primary, ...COMMON_TEXT_STYLES }} fontSize={{ xs: '22px', md: '24px' }}>Bienvenido</ResponsiveBox>
          <ResponsiveBox as="p" className="text-body" style={{ color: colors.text.secondary, ...COMMON_TEXT_STYLES }} fontSize={{ xs: '13px', md: '14px' }}>Te mostraremos brevemente cada sección para que aproveches al máximo la aplicación.</ResponsiveBox>
          <ResponsiveBox display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap="10px" width="100%">
            <ResponsiveBox as="button" className="text-btn font-semibold" style={WELCOME_STYLES.primaryButton} onClick={isFirstTime ? handleContinue : handleStart}>{isFirstTime ? 'Continuar' : 'Comenzar'}</ResponsiveBox>
            {!isFirstTime && (
              <ResponsiveBox as="button" className="text-btn font-medium" style={WELCOME_STYLES.secondaryButton} onClick={skip}>Saltar</ResponsiveBox>
            )}
          </ResponsiveBox>
        </ResponsiveBox>
      </Container>
    </ResponsiveBox>
  </>
);

const MISSING_TARGET_STYLES = {
  overlay: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: Z_INDEX_BASE },
  card: { borderRadius: borderRadius.md, boxShadow: shadows.level1, border: `1px solid ${colors.border.primary}` },
  button: { background: colors.brand.primary, color: colors.text.primary, border: 'none', borderRadius: borderRadius.sm, padding: '8px 14px', ...COMMON_BUTTON_STYLES }
};

const MissingTarget: React.FC<{ selector: string; onContinue: () => void; }> = ({ selector, onContinue }) => (
  <ResponsiveBox display="flex" style={MISSING_TARGET_STYLES.overlay} alignItems="center" justifyContent="center" padding="16px">
    <ResponsiveBox bg={colors.background.secondary} style={MISSING_TARGET_STYLES.card} padding="24px" maxWidth="340px" textAlign="center" display="flex" flexDirection="column" gap="14px">
      <ResponsiveBox as="h3" className="text-h3 font-semibold" style={{ color: colors.status.error, ...COMMON_TEXT_STYLES }} fontSize={{ xs: '16px', md: '18px' }}>Elemento no encontrado</ResponsiveBox>
      <ResponsiveBox as="p" className="text-body" style={{ color: colors.text.secondary, ...COMMON_TEXT_STYLES }} fontSize={{ xs: '12px', md: '13px' }}>No se encontró: <code style={{ color: colors.brand.primary }}>{selector}</code></ResponsiveBox>
      <ResponsiveBox as="button" onClick={onContinue} className="text-btn font-semibold" style={MISSING_TARGET_STYLES.button}>Continuar</ResponsiveBox>
    </ResponsiveBox>
  </ResponsiveBox>
);

export const TutorialOverlay: React.FC = () => {
  const { isActive, currentStep, steps, nextStep, previousStep, skipTutorial, isFirstTime } = useTutorial();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Ref para medir dinámicamente el tamaño real del tooltip (contenido variable)
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [tooltipSize, setTooltipSize] = useState({ width: 320, height: 180 });
  
  const currentStepData = steps[currentStep];
  
  const handleStartTutorial = () => {
    setIsTransitioning(true);
    setShowWelcome(false);
    setTimeout(() => setIsTransitioning(false), 150);
  };

  const handleContinueToApp = () => isFirstTime ? handleStartTutorial() : skipTutorial();
  
  useEffect(() => {
    if (!isActive || !currentStepData || showWelcome) return;
    
    const updateTargetPosition = () => {
      const targetElement = document.querySelector(currentStepData.target);
      setTargetRect(targetElement ? targetElement.getBoundingClientRect() : null);
    };

    updateTargetPosition();
    window.addEventListener('resize', updateTargetPosition);
    window.addEventListener('scroll', updateTargetPosition);

    return () => {
      window.removeEventListener('resize', updateTargetPosition);
      window.removeEventListener('scroll', updateTargetPosition);
    };
  }, [isActive, currentStepData, showWelcome]);
  
  useLayoutEffect(() => {
    if (tooltipRef.current) {
      const rect = tooltipRef.current.getBoundingClientRect();
      if (Math.abs(rect.width - tooltipSize.width) > TOOLTIP_MEASURE_THRESHOLD || Math.abs(rect.height - tooltipSize.height) > TOOLTIP_MEASURE_THRESHOLD) {
        setTooltipSize({ width: rect.width, height: rect.height });
      }
    }
  }, [currentStep, targetRect, showWelcome, tooltipSize.width, tooltipSize.height]);

  if (!isActive || !currentStepData || isTransitioning) return null;
  if (showWelcome) return <WelcomeScreen isFirstTime={isFirstTime} handleContinue={handleContinueToApp} handleStart={handleStartTutorial} skip={skipTutorial} />;
  if (!targetRect) return <MissingTarget selector={currentStepData.target} onContinue={nextStep} />;
  
  const calculateTooltipPosition = (): TooltipPositionResult => {
    const marginBase = 18;
    const customGap = typeof currentStepData.gap === 'number' ? currentStepData.gap : TOOLTIP_MIN_GAP;
    const effectiveGap = customGap + ARROW_SIZE;
    const tooltipWidth = tooltipSize.width || TOOLTIP_DEFAULT_SIZE.width;
    const tooltipHeight = tooltipSize.height || TOOLTIP_DEFAULT_SIZE.height;

    const spaces = {
      above: targetRect.top - SCREEN_MARGIN,
      below: window.innerHeight - targetRect.bottom - SCREEN_MARGIN,
      left: targetRect.left - SCREEN_MARGIN,
      right: window.innerWidth - targetRect.right - SCREEN_MARGIN
    };

    const offsetX = currentStepData.offset?.x || 0;
    const offsetY = currentStepData.offset?.y || 0;

    let preferred: 'top' | 'bottom' | 'left' | 'right' = currentStepData.position || 'top';
    const needsHeight = tooltipHeight + effectiveGap;
    const needsWidth = tooltipWidth + marginBase;

    if (preferred === 'top' && spaces.above < needsHeight && spaces.below > spaces.above) preferred = 'bottom';
    else if (preferred === 'bottom' && spaces.below < needsHeight && spaces.above > spaces.below) preferred = 'top';
    else if (preferred === 'left' && spaces.left < needsWidth && spaces.right > spaces.left) preferred = 'right';
    else if (preferred === 'right' && spaces.right < needsWidth && spaces.left > spaces.right) preferred = 'left';

    if (['top','bottom'].includes(preferred) && spaces.above < needsHeight && spaces.below < needsHeight) {
      preferred = spaces.above > spaces.below ? 'top' : 'bottom';
    } else if (['left','right'].includes(preferred) && spaces.left < needsWidth && spaces.right < needsWidth) {
      preferred = spaces.left > spaces.right ? 'left' : 'right';
    }

    let left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
    let top = targetRect.top - tooltipHeight - effectiveGap;

    const positions = {
      bottom: () => { top = targetRect.bottom + effectiveGap; },
      left: () => { left = targetRect.left - tooltipWidth - marginBase; top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2; },
      right: () => { left = targetRect.right + marginBase; top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2; }
    };
    positions[preferred as keyof typeof positions]?.();

    if (preferred === 'top') {
      const overlapDelta = (top + tooltipHeight) - (targetRect.top - customGap);
      if (overlapDelta > 0) top -= overlapDelta;
    } else if (preferred === 'bottom' && top < targetRect.bottom + customGap) {
      top = targetRect.bottom + customGap;
    }

    left = clamp(left + offsetX, 12, window.innerWidth - tooltipWidth - 12);
    top = clamp(top + offsetY, 12, window.innerHeight - tooltipHeight - 12);

    return { left, top, position: preferred };
  };

  const { left, top, position } = calculateTooltipPosition();
  
  const { spotlight, highlight } = getDerivedRects(targetRect);

  const OVERLAY_STYLES = {
    container: { position: 'fixed' as const, inset: 0, zIndex: Z_INDEX_BASE, pointerEvents: 'auto' as const, fontFamily: fontFamilies.primary },
    svg: { position: 'absolute' as const, top: 0, left: 0, width: '100%', height: '100%' },
    highlight: { position: 'absolute' as const, border: `2px solid ${colors.brand.primary}`, borderRadius: borderRadius.sm, boxShadow: `0 0 14px ${colors.brand.primary}60`, pointerEvents: 'none' as const },
    tooltip: { position: 'absolute' as const, borderRadius: borderRadius.lg, boxShadow: shadows.level1, border: `1px solid ${colors.border.primary}`, background: colors.background.secondary }
  };

  return (
  <ResponsiveBox style={OVERLAY_STYLES.container}>
      <svg style={OVERLAY_STYLES.svg}>
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect x={spotlight.x} y={spotlight.y} width={spotlight.width} height={spotlight.height} rx={spotlight.rx} fill="black" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0.85)" mask="url(#spotlight-mask)" />
      </svg>

  <ResponsiveBox style={{ ...OVERLAY_STYLES.highlight, left: highlight.left, top: highlight.top, width: highlight.width, height: highlight.height }} />

      <ResponsiveBox
        style={{ ...OVERLAY_STYLES.tooltip, left: `${left}px`, top: `${top}px` }}
        ref={tooltipRef}
        width={{ xs: '260px', sm: '300px' }} maxWidth="92vw" padding={{ xs: '16px', sm: '18px' }} maxHeight="58vh" overflow="hidden" display="flex" flexDirection="column" gap="10px"
      >
        <Arrow position={position} />
        
        <ResponsiveBox display="flex" justifyContent="space-between" alignItems="center" style={{ flexShrink: 0 }}>
          <ResponsiveBox as="h2" className="text-h3 font-semibold" style={{ color: colors.text.primary, ...COMMON_TEXT_STYLES, lineHeight: '1.25' }} fontSize={{ xs: '15px', sm: '16px' }}>{currentStepData.title}</ResponsiveBox>
          <ResponsiveBox className="text-caption" style={{ color: colors.text.tertiary, padding: '2px 6px', borderRadius: borderRadius.sm, background: colors.background.tertiary }} fontSize={{ xs: '9px', sm: '10px' }}>{currentStep + 1} / {steps.length}</ResponsiveBox>
        </ResponsiveBox>
        
        <ResponsiveBox style={{ flex: 1, overflow: 'hidden' }}>
          <ResponsiveBox as="p" className="text-body" style={{ color: colors.text.secondary, ...COMMON_TEXT_STYLES, lineHeight: '1.45' }} fontSize={{ xs: '12.5px', sm: '13px' }}>{currentStepData.description}</ResponsiveBox>
        </ResponsiveBox>
        
        <ResponsiveBox display="flex" justifyContent="space-between" alignItems="center" style={{ flexShrink: 0 }}>
          <ResponsiveBox as="button" onClick={skipTutorial} className="text-caption font-medium" style={{ background: 'transparent', border: 'none', color: colors.text.tertiary, ...COMMON_BUTTON_STYLES }}>Saltar</ResponsiveBox>
          <ResponsiveBox display="flex" gap="6px">
            {currentStep > 0 && (
              <ResponsiveBox as="button" onClick={previousStep} className="text-caption" style={{ background: colors.background.tertiary, color: colors.text.secondary, border: `1px solid ${colors.border.secondary}`, borderRadius: borderRadius.sm, padding: '5px 10px', ...COMMON_BUTTON_STYLES }}>Anterior</ResponsiveBox>
            )}
            <ResponsiveBox as="button" onClick={nextStep} className="text-caption font-semibold" style={{ background: colors.brand.primary, color: colors.text.primary, border: 'none', borderRadius: borderRadius.sm, padding: '5px 10px', ...COMMON_BUTTON_STYLES }}>
              {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
            </ResponsiveBox>
          </ResponsiveBox>
        </ResponsiveBox>
        
        <ResponsiveBox display="flex" justifyContent="center" gap="4px" style={{ flexShrink: 0 }}>
          {steps.map((_, i) => (
            <ResponsiveBox key={i} style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: i === currentStep ? colors.brand.primary : (i < currentStep ? colors.brand.soft : colors.border.secondary) }} />
          ))}
        </ResponsiveBox>
      </ResponsiveBox>
      
    </ResponsiveBox>
  );
};
