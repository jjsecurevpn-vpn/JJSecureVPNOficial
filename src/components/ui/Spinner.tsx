import React from 'react';

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'brand' | 'neutral' | 'light' | 'success' | 'danger';
  className?: string;
  inline?: boolean;
  thickness?: 'thin' | 'normal' | 'thick';
}

const sizeMap: Record<string,string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const thicknessMap: Record<string,string> = {
  thin: 'border',
  normal: 'border-2',
  thick: 'border-4'
};

const colorMap: Record<string,string> = {
  brand: 'border-brand/30 border-t-brand',
  neutral: 'border-neutral-text/30 border-t-neutral-text',
  light: 'border-white/30 border-t-white',
  success: 'border-success/30 border-t-success',
  danger: 'border-danger/30 border-t-danger'
};

export const Spinner: React.FC<SpinnerProps> = ({ size='sm', color='brand', className='', inline=false, thickness='normal' }) => {
  const base = 'rounded-full animate-spin';
  const sizeCls = sizeMap[size] || sizeMap.sm;
  const thickCls = thicknessMap[thickness] || thicknessMap.normal;
  const classes = [base, sizeCls, thickCls, colorMap[color], inline ? 'inline-flex' : 'flex', className]
    .filter(Boolean)
    .join(' ');
  return <span className={classes} />;
};
