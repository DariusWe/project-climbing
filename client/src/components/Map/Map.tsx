import classes from "./Map.module.scss";
import mapboxgl, { LngLatLike, GeoJSONSource, GeoJSONSourceRaw, Map } from "mapbox-gl";
import { useRef, useEffect } from "react";
import markerImage from "../../assets/marker.png";

type WorldMapProps = {
  geoData: GeoJSONSourceRaw | undefined;
};

const mapboxToken = import.meta.env.VITE_APP_MAPBOX_TOKEN;

const WorldMap: React.FC<WorldMapProps> = ({ geoData }) => {
  // Get reference to the HTML-Element that will contain the map
  const mapContainer = useRef<HTMLDivElement | null>(null);

  // Define a ref that will store the map
  const map = useRef<Map | null>();

  // Paint the map as soon as the HTML element reference is available
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/darius222/clg2xknp3005g01myy2e6p5rn",
      center: [21.472858, 38.181548],
      zoom: 9,
      minZoom: 3,
      pitchWithRotate: false,
      dragRotate: false,
    });
  }, [mapContainer.current]);

  // When geoData of climbing crags is available, add data and functionality to map.
  useEffect(() => {
    if (!geoData || !map.current) return;

    map.current.on("load", () => {
      // In the following lines, typescript warns me that map.current could possibly be null or undefined, which is not true.
      // With "!" i am telling typescript that map.current is not null or undefined
      map.current!.loadImage(markerImage, (error, image) => {
        if (error || image === undefined) throw error;
        map.current!.addImage("custom-marker", image);
        map.current!.addSource("points", geoData);
        map.current!.addLayer({
          id: "cluster-shadow",
          type: "circle",
          source: "points",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": "#000",
            "circle-opacity": 0.2,
            "circle-radius": ["step", ["get", "point_count"], 21, 5, 28, 20, 35],
            "circle-blur": 0.9,
            "circle-translate": [3, 5],
          },
        });
        map.current!.addLayer({
          id: "clusters",
          type: "circle",
          source: "points",
          filter: ["has", "point_count"],
          paint: {
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            // "circle-color": "#f8c304",
            // "circle-color": "#ecc76f",
            // "circle-color": "#ffe921",
            "circle-color": "#fff",
            "circle-radius": ["step", ["get", "point_count"], 15, 5, 20, 20, 25],
          },
        });
        map.current!.addLayer({
          id: "cluster-count",
          type: "symbol",
          source: "points",
          filter: ["has", "point_count"],
          layout: {
            "text-field": ["get", "point_count_abbreviated"],
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          },
        });
        map.current!.addLayer({
          id: "unclustered-point-shadow",
          type: "circle",
          source: "points",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "#000",
            "circle-opacity": 0,
            "circle-radius": 10,
            "circle-blur": 0.9,
            "circle-translate": [2, 3],
          },
        });
        map.current!.addLayer({
          id: "unclustered-point",
          type: "circle",
          source: "points",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-radius": 5,
            "circle-color": "#fff",
            "circle-stroke-width": 1,
            "circle-stroke-color": "#333",
          },
        });
      });
    });

    // inspect a cluster on click
    map.current!.on("click", "clusters", (e) => {
      const features = map.current!.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      if (!features[0] || !features[0].properties) return;
      const clusterId = features[0].properties.cluster_id;
      (map.current!.getSource("points") as GeoJSONSource).getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        if (features[0].geometry.type !== "Point") return;
        map.current!.easeTo({
          center: features[0].geometry.coordinates as LngLatLike,
          zoom: zoom,
        });
      });
    });

    map.current!.on("click", "unclustered-point", (e) => {
      // Typescript is complaining about a bunch of variables that could either be null or undefined or can't be found
      // because of stupid fucking reasons that i have no control over. Why does everyone like typescript so much again?
      if (
        !e.features ||
        !e.features[0].properties ||
        !e.features[0].geometry ||
        e.features[0].geometry.type !== "Point"
      )
        return;
      const name = e.features[0].properties["name"];
      // TS complaining about coordinates being of type Number[] instead of LngLatLike even though it's derived from Mapbox own types...
      const coordinates = e.features[0].geometry.coordinates.slice() as LngLatLike;
      const description = `Name: ${name}`;
      const html = `<div class="mapbox-popup-img"></div>
                    <div class="mapbox-popup-right-side">
                      <h3>Name of site</h3>
                      <p>Some more infos like number of routes and grades</p>
                    </div>`;

      new mapboxgl.Popup({ offset: 8 }).setLngLat(coordinates).setHTML(html).addTo(map.current!);
    });

    map.current!.on("mouseenter", ["unclustered-point", "clusters"], () => {
      map.current!.getCanvas().style.cursor = "pointer";
    });

    map.current!.on("mouseleave", ["unclustered-point", "clusters"], () => {
      map.current!.getCanvas().style.cursor = "";
    });

    map.current!.on("contextmenu", (event) => {
      const lngLat = mapboxgl.LngLat.convert(event.lngLat);
      new mapboxgl.Popup({ offset: 8 }).setLngLat(lngLat).setHTML(`<span>${lngLat}</span>`).addTo(map.current!);
    });
  }, [geoData]);

  return <div ref={mapContainer} className={classes.mapContainer} />;
};

export default WorldMap;
