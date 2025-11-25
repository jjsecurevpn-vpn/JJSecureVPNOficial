import { useState, useCallback, useMemo } from 'react';
import { es } from '../translations/es';
import { en } from '../translations/en';
import { pt } from '../translations/pt';
import type { SupportedLanguage, Translations } from '../translations/types';

// Clave para almacenamiento local del idioma
const LANGUAGE_KEY = 'jjsecure_language';

// Función para obtener el idioma inicial
const getInitialLanguage = (): SupportedLanguage => {
  const savedLang = localStorage.getItem(LANGUAGE_KEY);
  if (savedLang && ['es', 'en', 'pt'].includes(savedLang)) {
    return savedLang as SupportedLanguage;
  }
  // Intentar detectar el idioma del navegador
  const browserLang = navigator.language.split('-')[0];
  if (['es', 'en', 'pt'].includes(browserLang)) {
    return browserLang as SupportedLanguage;
  }
  return 'es'; // Idioma por defecto
};

export const useTranslations = () => {
  // Usamos useState para manejar el idioma actual
  const [currentLanguage, setCurrentLanguageState] = useState<SupportedLanguage>(getInitialLanguage);

  // Memoizamos las traducciones para el idioma actual
  const t: Translations = useMemo(() => {
    switch (currentLanguage) {
      case 'en':
        return en;
      case 'pt':
        return pt;
      case 'es':
      default:
        return es;
    }
  }, [currentLanguage]); // Ahora depende del idioma actual

  // Función para cambiar el idioma
  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setCurrentLanguageState(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
  }, []);

  // Retornamos las traducciones y la función para cambiar el idioma
  return {
    t,
    setLanguage,
    currentLanguage
  };
};
