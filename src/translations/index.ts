/**
 * @file index.ts
 * @description Punto de entrada principal para el sistema de traducciones
 */

import { es } from './es';
import { en } from './en';
import { pt } from './pt';
export type { Translations, SupportedLanguage, LanguageInfo } from './types';
import type { Translations, SupportedLanguage, LanguageInfo } from './types';

// Diccionario completo de traducciones
export const translations = {
  es,
  en,
  pt,
};

// Configuración de idiomas disponibles
export const AVAILABLE_LANGUAGES: LanguageInfo[] = [
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹'
  }
];

// Función helper para obtener traducciones
export const getTranslations = (language: SupportedLanguage): Translations => {
  return translations[language] || translations.es;
};

// Función helper para detectar idioma del navegador
export const detectBrowserLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') return 'es';
  
  const browserLang = window.navigator.language || window.navigator.languages?.[0] || 'es';
  const langCode = browserLang.split('-')[0].toLowerCase();
  
  if (langCode === 'en') return 'en';
  if (langCode === 'pt') return 'pt';
  return 'es'; // Default fallback
};
