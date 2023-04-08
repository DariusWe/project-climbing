import classes from "./App.module.scss";
import Header from "./components/Header/Header";
import WorldMap from "./components/Map/Map";
import { useQuery } from "@tanstack/react-query";
import { fetchWalls } from "./api/queries";
import { useState } from "react";
import convertToGeoJson from "./utils/convertToGeoJson";
import type { GeoJSONSourceRaw } from "mapbox-gl";
import type { Wall } from "./api/types";

const App = () => {
  const [geoJsonData, setGeoJsonData] = useState<GeoJSONSourceRaw>();

  const { data, status } = useQuery({
    queryKey: ["walls"],
    queryFn: fetchWalls,
    onSuccess: (data: Wall[]) => {
      setGeoJsonData(convertToGeoJson(data));
    },
  });

  return (
    <div className={classes.app}>
      <Header />
      <WorldMap geoData={geoJsonData} />
    </div>
  );
};

export default App;
