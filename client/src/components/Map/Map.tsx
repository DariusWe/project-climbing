import classes from "./Map.module.scss";
import mapboxgl, { LngLatLike, GeoJSONSource, GeoJSONSourceRaw, Map } from "mapbox-gl";
import { useRef, useEffect, FC } from "react";
import ReactDOM from "react-dom/client";
import MapPopup from "../MapPopup/MapPopup";

mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX_TOKEN;

type WorldMapProps = {
  geoData: GeoJSONSourceRaw | undefined;
};

const WorldMap: FC<WorldMapProps> = ({ geoData }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<Map | null>();

  // If geoData changes, reset map. Don't do this in a useEffect, do it right here.

  // Paint the map, geoData is not beeing fetched yet
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/darius222/clg2xknp3005g01myy2e6p5rn",
      center: [11.287380, 49.693085],
      zoom: 9,
      minZoom: 3,
      pitchWithRotate: false,
      dragRotate: false,
    });

    return () => map.current!.remove();
  }, []);

  // When geodata is fetched, attach data to map
  useEffect(() => {
    if (!geoData || !map.current) return;

    map.current.on("load", () => {
      // In the following lines, typescript warns me that map.current could possibly be null or undefined, which is not true.
      // With "!" i am telling typescript that map.current is not null or undefined
      map.current!.addSource("crags", geoData);
      map.current!.addLayer({
        id: "shadow-for-cluster",
        type: "circle",
        source: "crags",
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
        id: "cluster",
        type: "circle",
        source: "crags",
        filter: ["has", "point_count"],
        paint: {
          // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
          // with three steps to implement three cluster sizes:
          "circle-color": "#fff",
          "circle-radius": ["step", ["get", "point_count"], 15, 5, 20, 20, 25],
        },
      });
      map.current!.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "crags",
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });
      map.current!.addLayer({
        id: "shadow-for-unclustered-point",
        type: "circle",
        source: "crags",
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
        source: "crags",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-radius": 5,
          "circle-color": "#fff",
          "circle-stroke-width": 1,
          "circle-stroke-color": "#333",
        },
      });
    });

    // inspect a cluster on click
    map.current!.on("click", "cluster", (e) => {
      const features = map.current!.queryRenderedFeatures(e.point, {
        layers: ["cluster"],
      });
      if (!features[0] || !features[0].properties) return;
      const clusterId = features[0].properties.cluster_id;
      (map.current!.getSource("crags") as GeoJSONSource).getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        if (features[0].geometry.type !== "Point") return;
        map.current!.easeTo({
          center: features[0].geometry.coordinates as LngLatLike,
          zoom: zoom,
        });
      });
    });

    map.current!.on("click", "unclustered-point", (e) => {
      const cragName = e.features![0].properties!["name"];
      const cragImageUrl = e.features![0].properties!["imgUrlSmall"];
      if (e.features![0].geometry.type !== "Point") return;
      const coordinates = e.features![0].geometry.coordinates.slice() as LngLatLike;

      const popupNode = document.createElement("div");
      ReactDOM.createRoot(popupNode).render(<MapPopup name={cragName} imgUrl={cragImageUrl} />);

      new mapboxgl.Popup({ offset: 8 }).setLngLat(coordinates).setDOMContent(popupNode).addTo(map.current!);
    });

    map.current!.on("mouseenter", ["unclustered-point", "cluster"], () => {
      map.current!.getCanvas().style.cursor = "pointer";
    });

    map.current!.on("mouseleave", ["unclustered-point", "cluster"], () => {
      map.current!.getCanvas().style.cursor = "";
    });
  }, [geoData]);

  return <div ref={mapContainer} className={classes.mapContainer} />;
};

export default WorldMap;
