import type { Crag } from "../api/types";
import { GeoJSONSourceRaw } from "mapbox-gl";
import { Feature } from "geojson";

const convertToGeoJson = (crags:Crag[]): GeoJSONSourceRaw => {
  // Convert crags array to Mapbox 'Feature' type
  const featureArray: Feature[] = crags.map((crag) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [crag.longitude, crag.latitude],
      },
      properties: {
        id: crag.id,
        name: crag.name,
        imgUrlSmall: crag.img_url_small,
      },
    };
  });

  // Convert features to Mapbox 'GeoJSONSourceRaw' type
  const geoJsonData: GeoJSONSourceRaw = {
    type: "geojson",
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 30,
    data: {
      type: "FeatureCollection",
      features: featureArray,
    },
  };

  return geoJsonData;
};

export default convertToGeoJson;