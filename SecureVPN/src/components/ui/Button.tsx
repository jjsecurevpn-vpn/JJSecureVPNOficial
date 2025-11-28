import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'soft' | 'quick';
  className?: string;
  disabled?: boolean;
}

export function Button({ children, onClick, variant = 'default', className = '', disabled }: ButtonProps) {
  const variantClass = {
    default: 'btn',
    primary: 'btn primary',
    soft: 'btn soft',
    quick: 'qbtn',
  }[variant];

  return (
    <button
      className={`${variantClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
