export interface MapColors {
  default: {
    fill: string;
    stroke: string;
    strokeWidth: number;
  };
  highlighted: {
    fill: string;
    stroke: string;
    strokeWidth: number;
  };
  defaultHover: { fill: string };
  highlightedHover: { fill: string };
}

// Configuración de colores del mapa
export const MAP_COLORS: MapColors = {
  default: {
    fill: 'rgba(71, 85, 105, 0.6)',
    stroke: 'rgba(71, 85, 105, 0.9)',
    strokeWidth: 1.5
  },
  highlighted: {
    fill: 'rgba(107, 114, 128, 0.7)',
    stroke: 'rgba(107, 114, 128, 1)',
    strokeWidth: 2.5
  },
  defaultHover: {
    fill: 'rgba(71, 85, 105, 0.8)'
  },
  highlightedHover: {
    fill: 'rgba(107, 114, 128, 0.9)'
  }
} as const;

// Constantes de timing
export const MAP_TRANSITION_MS = 800;
export const MAP_FALLBACK_DELAY = 1200;
export const MAP_FALLBACK_COORDS: [number, number] = [-58.3960, -34.6118]; // Buenos Aires

// URL del mapa mundial optimizado (50m)
export const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

/**
 * Obtiene coordenadas inteligentes priorizando props sobre geoData
 * @returns Coordenadas válidas o null si no hay datos disponibles
 */
export const getSmartCoords = (
  current?: [number, number],
  geoData?: { latitude?: number; longitude?: number } | null
): [number, number] | null => {
  // Prioridad 1: Coordenadas prop
  if (current && current[0] !== undefined && current[1] !== undefined) {
    return current;
  }
  
  // Prioridad 2: Datos de geolocalización válidos
  if (geoData?.latitude && geoData?.longitude && 
      !isNaN(geoData.latitude) && !isNaN(geoData.longitude)) {
    return [geoData.longitude, geoData.latitude];
  }
  
  return null;
};
