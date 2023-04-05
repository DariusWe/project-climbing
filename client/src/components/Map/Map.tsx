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
    });

    mapAlreadyExists.current = true;

    map.on("load", () => {
      map.loadImage(markerImage, (error, image) => {
        if (error || image === undefined) throw error;
        map.addImage("custom-marker", image);
        map.addSource("points", SPOTS);
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
            "circle-color": ["step", ["get", "point_count"], "#51bbd6", 100, "#f1f075", 750, "#f28cb1"],
            "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
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
          id: "unclustered-point",
          type: "symbol",
          source: "points",
          filter: ["!", ["has", "point_count"]],
          layout: {
            "icon-image": "custom-marker",
            // "icon-anchor": "bottom",
            "icon-size": 0.32,
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

      new mapboxgl.Popup({className: "mapbox-popup"}).setLngLat(coordinates).setHTML(description).addTo(map);
    });

    map.on("mouseenter", "unclustered-point", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "unclustered-point", () => {
      map.getCanvas().style.cursor = "";
    });
  }, [mapContainer.current]);

  return <div ref={mapContainer} className={classes.mapContainer} />;
};

export default Map;
