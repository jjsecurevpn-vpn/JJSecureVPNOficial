/**
 * @file LanguageContext.tsx
 * @description Contexto para manejo de idiomas y traducciones - Refactorizado con archivos separados
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  AVAILABLE_LANGUAGES, 
  getTranslations, 
  detectBrowserLanguage,
  type Translations, 
  type SupportedLanguage, 
  type LanguageInfo 
} from '../translations';

// Tipo del contexto
interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: Translations;
  availableLanguages: LanguageInfo[];
  getCurrentLanguageInfo: () => LanguageInfo;
}

// Contexto
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Clave para localStorage
const STORAGE_KEY = 'jjsecure_language';

interface LanguageProviderProps {
  children: ReactNode;
}

// Provider del contexto
export function LanguageProvider({ children }: LanguageProviderProps) {
  // Inicializar idioma desde localStorage o detectar del navegador
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    if (typeof window === 'undefined') return 'es';
    
    const stored = localStorage.getItem(STORAGE_KEY) as SupportedLanguage;
    if (stored && ['es', 'en', 'pt'].includes(stored)) {
      return stored;
    }
    
    return detectBrowserLanguage();
  });

  // Efecto para persistir el idioma seleccionado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, currentLanguage);
    }
  }, [currentLanguage]);

  // Función para cambiar idioma
  const setLanguage = (language: SupportedLanguage) => {
    setCurrentLanguage(language);
  };

  // Función para obtener información del idioma actual
  const getCurrentLanguageInfo = (): LanguageInfo => {
    return AVAILABLE_LANGUAGES.find(lang => lang.code === currentLanguage) || AVAILABLE_LANGUAGES[0];
  };

  // Valor del contexto
  const contextValue: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t: getTranslations(currentLanguage),
    availableLanguages: AVAILABLE_LANGUAGES,
    getCurrentLanguageInfo,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook para usar el contexto de idioma
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Hook para obtener solo las traducciones
export function useTranslations() {
  const { t } = useLanguage();
  return t;
}

// Re-exportar tipos para compatibilidad
export type { SupportedLanguage, LanguageInfo, Translations };
export { AVAILABLE_LANGUAGES };
