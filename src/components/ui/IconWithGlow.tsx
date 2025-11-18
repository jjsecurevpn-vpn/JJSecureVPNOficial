/**
 * @file IconWithGlow.tsx
 * @description Componente reutilizable para iconos con efecto de resplandor
 */

import React from 'react';

export interface IconWithGlowProps {
  icon: React.ReactNode;
  glowColor: string;
  iconColor: string;
  size?: number;
  className?: string;
}

export const IconWithGlow: React.FC<IconWithGlowProps> = ({
  icon,
  glowColor,
  iconColor,
  size = 128,
  className = '',
}) => {
  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* Efecto de resplandor */}
      <div 
        className="absolute inset-0 blur-xl rounded-full"
        style={{ backgroundColor: glowColor }}
      />
      
      {/* Icono central */}
      <div 
        className="relative z-10"
        style={{ color: iconColor }}
      >
        {icon}
      </div>
    </div>
  );
};
