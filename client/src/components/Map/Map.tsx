import classes from "./Map.module.scss";
import mapboxgl, { LngLatLike } from "mapbox-gl";
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
      style: "mapbox://styles/mapbox/outdoors-v12",
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
          id: "points",
          type: "symbol",
          source: "points",
          layout: {
            "icon-image": "custom-marker",
            // "icon-anchor": "bottom",
            "icon-size": 0.32,
          },
        });
      });
    });

    map.on("click", "points", (e) => {
      // Typescript is complaining about a bunch of variables that could either be null or undefined or can't be found
      // because of stupid fucking reasons that i have no control over. Why does everyone like typescript so much again?
      if (
        !e.features ||
        !e.features[0].properties ||
        !e.features[0].geometry ||
        e.features[0].geometry.type !== "Point"
      )
        return;
      // TS complains about "properties.title, but allows geometry.coordinates. Why?!"
      const title = e.features[0].properties["title"];
      // TS complaining about coordinates being of type Number[] instead of LngLatLike even though it's derived from Mapbox own types...
      const coordinates = e.features[0].geometry.coordinates.slice() as LngLatLike;
      const description = `Name: ${title}`;

      new mapboxgl.Popup().setLngLat(coordinates).setHTML(description).addTo(map);
    });

    map.on("mouseenter", "points", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // Change it back to a pointer when it leaves.
    map.on("mouseleave", "points", () => {
      map.getCanvas().style.cursor = "";
    });

  }, [mapContainer.current]);

  return <div ref={mapContainer} className={classes.mapContainer} />;
};

export default Map;
