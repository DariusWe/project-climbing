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
import AddCragPopup from "./components/AddCragPopup/AddCragPopup";
import useStore from "./store";

const App = () => {
  const [geoJsonData, setGeoJsonData] = useState<GeoJSONSourceRaw>();
  const [addCragPopupOpen] = useStore((state) => [state.addCragPopupOpen]);

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
      {/* 
      (mapModus === "setCoordinates" && <AddCragForm /> 
      or)
      appState === "addingCrag" && <AddCragForm />
      or
      new url. for this url render App but pass properties to it so it can render other stuff?
      or
      new page with new map
      */}
      <WorldMap geoData={geoJsonData} />
      {addCragPopupOpen && <AddCragPopup />}
    </div>
  );
};

export default App;
