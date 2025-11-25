/**
 * @file LanguageSelector.tsx
 * @description Selector de idiomas minimalista para el header - Solo muestra siglas (ES, EN, PT)
 */

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, type SupportedLanguage } from '../context/LanguageContext';

// Eliminado: inyección runtime de estilos duplicados. Usamos clases globales de animación.

interface LanguageSelectorProps {
  className?: string;
  style?: React.CSSProperties;
}

// Mapeo de códigos de idioma a siglas simples
const getLanguageCode = (lang: SupportedLanguage): string => {
  switch (lang) {
    case 'es': return 'ES';
    case 'en': return 'EN';
    case 'pt': return 'PT';
    default: return 'ES';
  }
};

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '', style }) => {
  const { currentLanguage, setLanguage, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Manejar escape para cerrar
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleLanguageSelect = (language: SupportedLanguage) => {
    setLanguage(language);
    setIsOpen(false);
  };

  const currentLangCode = getLanguageCode(currentLanguage);

  return (
  <div className={`relative ${className}`} style={style} ref={dropdownRef} data-tutorial="language-selector">
      {/* Botón minimalista - Similar al botón de tutorial */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center justify-center
          w-full h-full
          bg-transparent border-none 
          rounded text-white/90 
          hover:text-purple-400
          focus:outline-none 
          transition-all duration-200
          cursor-pointer
        "
        style={{
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Idioma actual: ${currentLangCode}. Presiona para cambiar idioma`}
        title={`Cambiar idioma (${currentLangCode})`}
      >
  <span className="text-xs font-semibold tracking-wider">
          {currentLangCode}
        </span>
      </button>

      {/* Dropdown menu - Desplegable simple */}
      {isOpen && (
        <div
          className="
            absolute top-full left-0 mt-1 z-50
            bg-slate-900/95 backdrop-blur-lg
            border border-white/10 rounded-lg
            shadow-xl shadow-black/50
            overflow-hidden
            min-w-[70px]
            animate-fade-in
          "
          role="listbox"
          aria-label="Seleccionar idioma"
        >
          {availableLanguages.map((language) => {
            const isSelected = language.code === currentLanguage;
            const langCode = getLanguageCode(language.code);
            
            return (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`
                  w-full flex items-center justify-center py-2 px-2
                  transition-colors duration-150
                  text-sm font-semibold
                  ${isSelected 
                    ? 'bg-purple-600/40 text-white' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }
                `}
                role="option"
                aria-selected={isSelected}
                aria-label={`Cambiar a ${language.nativeName}`}
              >
                {langCode}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
