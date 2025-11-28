import { memo } from "react";
import { ComposableMap, Geographies, ZoomableGroup } from "react-simple-maps";
import type { ConnectionState } from "../../../utils/connectionStates";
import type { CountryInfo } from "../utils/geoMappingUtils";
import { GEO_URL } from "../utils/mapUtils";
import { MapGeography } from "./MapGeography";
import { MapMarker } from "./MapMarker";

export interface MapCanvasProps {
  coordinates: [number, number];
  currentCountry: CountryInfo;
  vpnState: ConnectionState;
  isTransitioning: boolean;
}

const MapCanvasComponent = ({ coordinates, currentCountry, vpnState, isTransitioning }: MapCanvasProps) => {
  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{
        scale: 1200,
        center: [coordinates[0], coordinates[1] - 7],
      }}
      width={800}
      height={450}
      className="w-full h-full"
      style={{
        transform: "translate3d(0, 0, 0)",
        imageRendering: "auto",
      }}
    >
      <ZoomableGroup
        center={[0, 0]}
        zoom={1}
        translateExtent={[[-250, -120], [250, 120]]}
        className="map-zoom-group"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) => (
            <MapGeography
              geographies={geographies}
              currentCountry={currentCountry}
            />
          )}
        </Geographies>

        <MapMarker
          coordinates={coordinates}
          vpnState={vpnState}
          isTransitioning={isTransitioning}
          className="map-marker"
        />
      </ZoomableGroup>
    </ComposableMap>
  );
};

export const MapCanvas = memo(MapCanvasComponent);
export default MapCanvas;
