import classes from "./App.module.scss";
import Header from "./components/Header/Header";
import WorldMap from "./components/Map/Map";
import { useQuery } from "@tanstack/react-query";
import { fetchCrags } from "./api/queries";
import { useState } from "react";
import convertToGeoJson from "./utils/convertToGeoJson";
import type { GeoJSONSourceRaw } from "mapbox-gl";
import type { Crag } from "./api/types";
import SearchResults from "./components/SearchResults/SearchResults";

const App = () => {
  const [geoJsonData, setGeoJsonData] = useState<GeoJSONSourceRaw>();

  // Fetch data from server
  const { data, status } = useQuery({
    queryKey: ["crags"],
    queryFn: fetchCrags,
    onSuccess: (data: Crag[]) => {
      setGeoJsonData(convertToGeoJson(data));
    },
  });

  return (
    <div className={classes.app}>
      <Header />
      <SearchResults />
      <WorldMap geoData={geoJsonData} />
    </div>
  );
};

export default App;
