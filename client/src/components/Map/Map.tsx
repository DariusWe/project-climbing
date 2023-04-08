import classes from "./Map.module.scss";
import mapboxgl, { LngLatLike, GeoJSONSource, GeoJSONSourceRaw, Map } from "mapbox-gl";
import { useRef, useEffect } from "react";
import markerImage from "../../assets/marker.png";

type WorldMapProps = {
  geoData: GeoJSONSourceRaw | undefined;
};

const WorldMap: React.FC<WorldMapProps> = ({ geoData }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>();

  // Paint the map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken =
      "pk.eyJ1IjoiZGFyaXVzMjIyIiwiYSI6ImNsZzJjbWh3MDA0Mnozcm1td3Exd2xsa2kifQ.ijV6fV1M7vbW32bWUDU6LA";

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

  // When geoData fetching is successfull, add data to map.
  // This useEffect is a mess. Even though i am running map.current.on("load", () => {}), typescript will tell me
  // in the following lines that map could be null or undefined. So everytime i use map.current i have to cast it as type Map.
  useEffect(() => {
    if (!geoData || !map.current) return;

    map.current.on("load", () => {
      (map.current as Map).loadImage(markerImage, (error, image) => {
        if (error || image === undefined) throw error;
        (map.current as Map).addImage("custom-marker", image);
        (map.current as Map).addSource("points", geoData);
        (map.current as Map).addLayer({
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
        (map.current as Map).addLayer({
          id: "clusters",
          type: "circle",
          source: "points",
          filter: ["has", "point_count"],
          paint: {
            // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            // "circle-color": "#f8c304",
            // "circle-color": "#ecc76f",
            // "circle-color": "#ffe921",
            "circle-color": "#fff",
            "circle-radius": ["step", ["get", "point_count"], 15, 5, 20, 20, 25],
          },
        });
        (map.current as Map).addLayer({
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
        (map.current as Map).addLayer({
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
        (map.current as Map).addLayer({
          id: "unclustered-point",
          type: "circle",
          source: "points",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-radius": 5,
            "circle-color": "#fff",
            "circle-stroke-width": 1,
            "circle-stroke-color": "#333",
            //"circle-stroke-opacity": 0.1,
          },
        });
      });
    });

    // inspect a cluster on click
    (map.current as Map).on("click", "clusters", (e) => {
      const features = (map.current as Map).queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      if (!features[0] || !features[0].properties) return;
      const clusterId = features[0].properties.cluster_id;
      ((map.current as Map).getSource("points") as GeoJSONSource).getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        if (features[0].geometry.type !== "Point") return;
        (map.current as Map).easeTo({
          center: features[0].geometry.coordinates as LngLatLike,
          zoom: zoom,
        });
      });
    });

    (map.current as Map).on("click", "unclustered-point", (e) => {
      // Typescript is complaining about a bunch of variables that could either be null or undefined or can't be found
      // because of stupid fucking reasons that i have no control over. Why does everyone like typescript so much again?
      if (
        !e.features ||
        !e.features[0].properties ||
        !e.features[0].geometry ||
        e.features[0].geometry.type !== "Point"
      )
        return;
      // TS complains about "properties.name, but allows geometry.coordinates. Why?!"
      const name = e.features[0].properties["name"];
      // TS complaining about coordinates being of type Number[] instead of LngLatLike even though it's derived from Mapbox own types...
      const coordinates = e.features[0].geometry.coordinates.slice() as LngLatLike;
      const description = `Name: ${name}`;
      const html = `<div class="mapbox-popup-img"></div>
                    <div class="mapbox-popup-right-side">
                      <h3>Name of site</h3>
                      <p>Some more infos like number of routes and grades</p>
                    </div>`;

      new mapboxgl.Popup({ offset: 8 })
        .setLngLat(coordinates)
        .setHTML(html)
        .addTo(map.current as Map);
    });

    (map.current as Map).on("mouseenter", ["unclustered-point", "clusters"], () => {
      (map.current as Map).getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    (map.current as Map).on("mouseleave", ["unclustered-point", "clusters"], () => {
      (map.current as Map).getCanvas().style.cursor = "";
    });
  }, [geoData]);

  return <div ref={mapContainer} className={classes.mapContainer} />;
};

export default WorldMap;
