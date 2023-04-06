import classes from "./Map.module.scss";
import mapboxgl, { LngLatLike, GeoJSONSource } from "mapbox-gl";
import { useRef, useState, useEffect } from "react";
import SPOTS from "../../utils/spots";
import markerImage from "../../assets/marker.png";

mapboxgl.accessToken = "pk.eyJ1IjoiZGFyaXVzMjIyIiwiYSI6ImNsZzJjbWh3MDA0Mnozcm1td3Exd2xsa2kifQ.ijV6fV1M7vbW32bWUDU6LA";

const Map = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapAlreadyExists = useRef(false);
  // const [lng, setLng] = useState(-70.9);
  // const [lat, setLat] = useState(42.35);
  // const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (mapAlreadyExists.current || !mapContainer.current) return; // If there already is a map or mapContainer is null, return.

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/darius222/clg2xknp3005g01myy2e6p5rn",
      // style: "mapbox://styles/darius222/clg2rtpq6006801nrt2vhicdj",
      // style: "mapbox://styles/mapbox/outdoors-v12",
      // style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [21.472858, 38.181548],
      zoom: 9,
      minZoom: 3,
      pitchWithRotate: false,
      dragRotate: false,
    });

    mapAlreadyExists.current = true;

    map.on("load", () => {
      map.loadImage(markerImage, (error, image) => {
        if (error || image === undefined) throw error;
        map.addImage("custom-marker", image);
        map.addSource("points", SPOTS);
        map.addLayer({
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
        map.addLayer({
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
        map.addLayer({
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
        map.addLayer({
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
        map.addLayer({
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
    map.on("click", "clusters", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      if (!features[0] || !features[0].properties) return;
      const clusterId = features[0].properties.cluster_id;
      (map.getSource("points") as GeoJSONSource).getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        if (features[0].geometry.type !== "Point") return;
        map.easeTo({
          center: features[0].geometry.coordinates as LngLatLike,
          zoom: zoom,
        });
      });
    });

    map.on("click", "unclustered-point", (e) => {
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

      new mapboxgl.Popup({ offset: 8 }).setLngLat(coordinates).setHTML(html).addTo(map);
    });

    map.on("mouseenter", ["unclustered-point", "clusters"], () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", ["unclustered-point", "clusters"], () => {
      map.getCanvas().style.cursor = "";
    });
  }, [mapContainer.current]);

  return <div ref={mapContainer} className={classes.mapContainer} />;
};

export default Map;
