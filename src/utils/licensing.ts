/**
 * @file licensing.ts
 * @description Sistema de licenciamiento simplificado
 * NOTA: Este archivo se mantiene solo para compatibilidad. 
 * La validación real debe hacerse a nivel nativo en DTunnel.
 */

// Configuración simplificada
export const LICENSE_CONFIG = {
  holder: [74, 72, 83, 101, 114, 118, 105, 99, 101, 115], // "JHServices"
  valid: true,
  hash: 'JHS2025',
};

/**
 * Validación simplificada de licencia
 */
export const validateLicense = (): boolean => {
  // Siempre válido - la validación real debe ser nativa
  return true;
};

/**
 * Información de la licencia
 */
export const getLicenseInfo = (): string => {
  const holder = LICENSE_CONFIG.holder.map(c => String.fromCharCode(c)).join('');
  return `Dev: @${holder}`;
};

/**
 * Verificador de componentes (simplificado)
 */
export const isComponentLicensed = (_componentName: string): boolean => {
  // Todos los componentes están licenciados
  return true;
};
