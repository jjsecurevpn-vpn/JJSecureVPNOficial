// Mapa de territorios asociados a países soberanos
// Permite resaltar territorios de ultramar junto con su país principal
export const SOVEREIGN_ISO_ALIASES: Record<string, string[]> = {
  FR: ['FR', 'GF', 'GP', 'MQ', 'RE', 'YT', 'PM', 'BL', 'MF', 'PF', 'NC', 'WF', 'TF'],
  US: ['US', 'PR', 'VI', 'GU', 'MP', 'AS', 'UM'],
  GB: ['GB', 'GG', 'JE', 'IM'],
  DK: ['DK', 'GL', 'FO'],
  NL: ['NL', 'AW', 'CW', 'SX', 'BQ'],
  NO: ['NO', 'SJ', 'BV'],
  AU: ['AU', 'CX', 'CC', 'NF', 'HM'],
  CN: ['CN', 'HK', 'MO'],
  FI: ['FI', 'AX'],
};

// Mapeo de nombre normalizado a código ISO2
// Incluye variantes en español e inglés de países comunes
export const NAME_TO_ISO2: Record<string, string> = {
  FRANCE: 'FR', FRANCIA: 'FR',
  'UNITED KINGDOM': 'GB', 'REINO UNIDO': 'GB',
  'UNITED STATES': 'US', 'ESTADOS UNIDOS': 'US',
  GERMANY: 'DE', ALEMANIA: 'DE',
  ITALY: 'IT', ITALIA: 'IT',
  SPAIN: 'ES', ESPANA: 'ES', ESPAÑA: 'ES',
  PORTUGAL: 'PT',
  NETHERLANDS: 'NL', 'PAISES BAJOS': 'NL', 'PAÍSES BAJOS': 'NL',
  SWITZERLAND: 'CH', SUIZA: 'CH',
  NORWAY: 'NO', NORUEGA: 'NO',
  DENMARK: 'DK', DINAMARCA: 'DK',
  SWEDEN: 'SE', SUECIA: 'SE',
  BELGIUM: 'BE', BELGICA: 'BE', BÉLGICA: 'BE',
  IRELAND: 'IE', IRLANDA: 'IE',
  POLAND: 'PL', POLONIA: 'PL',
};

export interface CountryInfo {
  code2: string | null;
  nameNorm: string | null;
  normalize: (s: string) => string;
}

/**
 * Normaliza nombres de países removiendo acentos y convirtiendo a mayúsculas
 */
export const normalizeGeoCountryName = (name: string): string => {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim();
};

/**
 * Obtiene información estructurada del país actual
 */
export const getCurrentCountryInfo = (
  countryCode?: string, 
  countryName?: string
): CountryInfo => {
  return {
    code2: countryCode?.toUpperCase() || null,
    nameNorm: countryName ? normalizeGeoCountryName(countryName) : null,
    normalize: normalizeGeoCountryName
  };
};

/**
 * Extrae código ISO de las propiedades de una geografía
 */
export const extractISOCode = (geoProperties: any): string => {
  const props = geoProperties || {};
  let iso2 = (props.ISO_A2 || props.iso_a2 || props.ISO2 || props.iso2 || '').toString().toUpperCase();
  
  // Fallback por nombre si no hay ISO
  if (!iso2) {
    const nameRaw = (props.NAME || props.name || props.NAME_LONG || props.ADMIN || '').toString();
    const nameNorm = nameRaw ? normalizeGeoCountryName(nameRaw) : '';
    if (nameNorm && NAME_TO_ISO2[nameNorm]) {
      iso2 = NAME_TO_ISO2[nameNorm];
    }
  }

  return iso2;
};

/**
 * Verifica si una geografía corresponde al país actual
 */
export const isCurrentCountryGeography = (
  geoProperties: any, 
  currentCountry: CountryInfo
): boolean => {
  const iso2 = extractISOCode(geoProperties);
  const nameRaw = (geoProperties.NAME || geoProperties.name || geoProperties.NAME_LONG || geoProperties.ADMIN || '').toString();
  const nameNorm = nameRaw ? normalizeGeoCountryName(nameRaw) : '';

  // Verificar por código ISO (incluyendo territorios)
  const codeAliases = currentCountry.code2 
    ? (SOVEREIGN_ISO_ALIASES[currentCountry.code2] || [currentCountry.code2])
    : [];
  const matchByIso = currentCountry.code2 && codeAliases.includes(iso2);
  
  // Verificar por nombre normalizado
  const matchByName = !!(currentCountry.nameNorm && nameNorm === currentCountry.nameNorm);
  
  return matchByIso || matchByName;
};

/**
 * Separa geografías en destacadas (país actual) y normales
 */
export const separateGeographies = (
  geographies: any[], 
  currentCountry: CountryInfo
): { currentGeos: any[]; otherGeos: any[] } => {
  const currentGeos: any[] = [];
  const otherGeos: any[] = [];

  geographies.forEach((geo) => {
    if (isCurrentCountryGeography(geo.properties, currentCountry)) {
      currentGeos.push(geo);
    } else {
      otherGeos.push(geo);
    }
  });

  return { currentGeos, otherGeos };
};
