/**
 * @file categoryUtils.ts
 * @description Utilidades para categorizar y estilizar categorías de servidores
 */

import { ConfigCategory } from "../../../../types/config";

export type CategoryType = 'premium' | 'gratuito' | 'emergencias' | 'other';

/**
 * Determina el tipo de categoría basándose en su nombre
 */
export const getCategoryType = (category: ConfigCategory): CategoryType => {
  const categoryName = category.name.toLowerCase();
  
  // Verificar si tiene etiquetas en corchetes
  if (categoryName.includes('[premium]')) {
    return 'premium';
  }
  
  if (categoryName.includes('[gratuito]')) {
    return 'gratuito';
  }
  
  if (categoryName.includes('[emergencias]')) {
    return 'emergencias';
  }
  
  // Verificar si es premium (sin corchetes)
  if (categoryName.includes('premium') || categoryName.includes('vip') || categoryName.includes('pro')) {
    return 'premium';
  }
  
  // Verificar si es gratuito (sin corchetes)
  if (categoryName.includes('gratuito') || categoryName.includes('free') || categoryName.includes('gratis')) {
    return 'gratuito';
  }
  
  // Verificar si es emergencias (sin corchetes)
  if (categoryName.includes('emergencias') || categoryName.includes('emergency') || categoryName.includes('solo emergencias')) {
    return 'emergencias';
  }
  
  return 'other';
};

/**
 * Limpia el nombre de la categoría removiendo los prefijos [PREMIUM], [GRATUITO] y [EMERGENCIAS]
 */
export const getCleanCategoryName = (categoryName: string): string => {
  return categoryName
    .replace(/\[PREMIUM\]\s*/gi, '')
    .replace(/\[GRATUITO\]\s*/gi, '')
    .replace(/\[EMERGENCIAS\]\s*/gi, '')
    .trim();
};

/**
 * Obtiene los estilos visuales para un tipo de categoría
 */
export const getCategoryTypeStyles = (type: CategoryType, translations?: any) => {
  const texts = {
    premium: translations?.serverSelectorScreen?.categoryTypes?.premium || 'PREMIUM',
    free: translations?.serverSelectorScreen?.categoryTypes?.free || 'GRATUITO',
    emergency: translations?.serverSelectorScreen?.categoryTypes?.emergency || 'EMERGENCIAS'
  };

  // Estilos minimalistas (sin gradientes) manteniendo buen contraste
  switch (type) {
    case 'premium':
      return {
        badge: {
          text: texts.premium,
          color: '#9c89ff'
        },
        accent: {
          barColor: '#6d4aff',
          shadow: '0 0 0 1px rgba(109,74,255,0.22)'
        },
        subtleBg: 'rgba(109,74,255,0.12)'
      };
    case 'gratuito':
      return {
        badge: {
          text: texts.free,
          color: '#36d28f'
        },
        accent: {
          barColor: '#00b96b',
          shadow: '0 0 0 1px rgba(0,185,107,0.22)'
        },
        subtleBg: 'rgba(0,185,107,0.14)'
      };
    case 'emergencias':
      return {
        badge: {
          text: texts.emergency,
          color: '#f5b648'
        },
        accent: {
          barColor: '#f59e0b',
          shadow: '0 0 0 1px rgba(245,158,11,0.24)'
        },
        subtleBg: 'rgba(245,158,11,0.16)'
      };
    default:
      return null;
  }
};



export const formatServerCountLabel = (template: string, count: number): string => {
  const isSingular = count === 1;
  const normalizedTemplate = template.toLowerCase();
  let pluralSuffix = 's';

  if (normalizedTemplate.includes('servidor{plural}')) {
    pluralSuffix = 'es';
  }

  return template
    .replace('{count}', count.toString())
    .replace('{plural}', isSingular ? '' : pluralSuffix);
};


