/**
 * @file index.ts
 * @description Exportaciones principales de componentes UI reutilizables
 */

export { Button, type ButtonProps } from './Button';
export { Card, type CardProps } from './Card';
export { BulletList, type BulletListProps, type BulletListItem } from './BulletList';
export { OrderedList, type OrderedListProps, type OrderedListItem } from './OrderedList';
export { IconWithGlow, type IconWithGlowProps } from './IconWithGlow';
export { Text, type TextProps } from './Text';
export { FeatureCarousel, type FeatureCarouselProps, type FeatureSlideData } from './FeatureCarousel';
export { PlanSelector, type PlanSelectorProps, type PlanItem } from './PlanSelector';
export { FooterTabButton } from './FooterTabButton';
export { SettingsCard } from './SettingsCard';
export { LoadingState, ErrorState, EmptyState, type LoadingStateProps, type ErrorStateProps, type EmptyStateProps } from './StateComponents';
export { StatusIndicator, type StatusIndicatorProps } from './StatusIndicator';
export { InfoPanel, type InfoPanelProps } from './InfoPanel';
export { VPNStatusOverlay, type VPNStatusOverlayProps } from './VPNStatusOverlay';
export { ConnectedLockIcon, DisconnectedLockIcon, type VPNLockIconProps } from './VPNLockIcons';

// Sistema de layout responsivo universal
export { 
  ResponsiveBox, 
  Flex, 
  Grid, 
  Container, 
  Stack, 
  HStack,
  type ResponsiveBoxProps,
  type ResponsiveValue
} from './ResponsiveBox';
