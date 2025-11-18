/**
 * @file SearchInput.tsx
 * @description Input de búsqueda reutilizable con icono
 */

import { useRef } from 'react';
import { colors } from '../../../../constants/theme';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isTv?: boolean;
}

export function SearchInput({ 
  value, 
  onChange, 
  placeholder = "Buscar...",
  className = "",
  isTv = false
}: SearchInputProps) {
  // Id estable para que el input NO se remonte en cada render (evita perder foco al escribir)
  const inputIdRef = useRef(`search-input-${Math.random().toString(36).slice(2, 11)}`);
  const inputId = inputIdRef.current;
  
  return (
    <div className={`relative ${className}`}>
      <input
        id={inputId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        className={`w-full pl-3 pr-3 rounded-lg focus:outline-none relative z-0 ${isTv ? 'py-1.5 text-xs' : 'py-2.5 text-sm'}`}
        style={{
          backgroundColor: colors.background.secondary,
          border: `1px solid ${colors.border.secondary}`,
          color: colors.text.primary,
          fontSize: '14px',
          lineHeight: '20px',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          boxShadow: '0 0 0 0 rgba(109,74,255,0)',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none'
        }}
        onFocus={(event) => {
          event.target.style.borderColor = colors.brand.primary;
          event.target.style.boxShadow = '0 0 0 3px rgba(109,74,255,0.18)';
        }}
        onBlur={(event) => {
          event.target.style.borderColor = colors.border.secondary;
          event.target.style.boxShadow = '0 0 0 0 rgba(109,74,255,0)';
        }}
      />
    </div>
  );
}
