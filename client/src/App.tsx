import classes from "./App.module.scss";
import Header from "./components/Header/Header";
import WorldMap from "./components/Map/Map";
import { useQuery } from "@tanstack/react-query";
import { fetchCrags } from "./api/queries";
import convertToGeoJson from "./utils/convertToGeoJson";
import SearchResults from "./components/SearchResults/SearchResults";
import AddCragPopup from "./components/AddCragPopup/AddCragPopup";
import useStore from "./store";

const App = () => {
  const [addCragPopupOpen] = useStore((state) => [state.addCragPopupOpen]);

  // Fetch crags from the server. In the future this data could be several thousand entries, fetching them all at once and saving them in
  // cache might not be the best idea. Server side clustering would be the better strategy then.
  const { data, status } = useQuery({
    queryKey: ["crags"],
    queryFn: fetchCrags,
  });

  return (
    <div className={classes.app}>
      <Header />
      <SearchResults />
      {status === "success" && <WorldMap geoData={convertToGeoJson(data)} />}
      {addCragPopupOpen && <AddCragPopup />}
    </div>
  );
};

export default App;
