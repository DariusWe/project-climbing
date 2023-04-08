import type { Wall } from "../api/types";
import { GeoJSONSourceRaw } from "mapbox-gl";
import { Feature } from "geojson";

const convertToGeoJson = (walls: Wall[]): GeoJSONSourceRaw => {
  // Convert walls array to Mapbox 'Feature' type
  const featureArray: Feature[] = walls.map((wall) => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [wall.longitude, wall.latitude],
      },
      properties: {
        id: wall.id,
        name: wall.name,
        imgUrl: wall.img_url,
        description: wall.description,
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