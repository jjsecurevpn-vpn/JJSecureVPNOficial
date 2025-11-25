import React from 'react';
import { Geography } from 'react-simple-maps';
import { MAP_COLORS } from '../utils/mapUtils.ts';
import { separateGeographies, CountryInfo } from '../utils/geoMappingUtils.ts';

interface MapGeographyProps {
  geographies: any[];
  currentCountry: CountryInfo;
}

export type { MapGeographyProps };

// Estilos base para todas las geografías
const BASE_GEO_STYLES = {
  default: { outline: 'none', shapeRendering: 'crispEdges' as const },
  pressed: { outline: 'none', shapeRendering: 'crispEdges' as const }
};

const getHoverStyle = (fillColor: string) => ({
  outline: 'none',
  fill: fillColor,
  transition: 'fill 0.2s ease-in-out',
  shapeRendering: 'crispEdges' as const
});

export const MapGeography: React.FC<MapGeographyProps> = ({
  geographies,
  currentCountry
}) => {
  const { currentGeos, otherGeos } = separateGeographies(geographies, currentCountry);

  return (
    <>
      {otherGeos.map((geo: any) => (
        <Geography
          key={`other-${geo.rsmKey}`}
          geography={geo}
          fill={MAP_COLORS.default.fill}
          stroke={MAP_COLORS.default.stroke}
          strokeWidth={MAP_COLORS.default.strokeWidth}
          style={{
            ...BASE_GEO_STYLES,
            hover: getHoverStyle(MAP_COLORS.defaultHover.fill)
          }}
        />
      ))}

      {currentGeos.map((geo: any) => (
        <Geography
          key={`current-${geo.rsmKey}`}
          geography={geo}
          fill={MAP_COLORS.highlighted.fill}
          stroke={MAP_COLORS.highlighted.stroke}
          strokeWidth={MAP_COLORS.highlighted.strokeWidth}
          style={{
            ...BASE_GEO_STYLES,
            hover: getHoverStyle(MAP_COLORS.highlightedHover.fill)
          }}
        />
      ))}
    </>
  );
};
