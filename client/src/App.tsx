import classes from "./App.module.scss";
import Header from "./components/Header/Header";
import CragMap from "./components/CragMap/CragMap";
import { useQuery } from "@tanstack/react-query";
import { fetchCrags } from "./api/queries";
import convertToGeoJson from "./utils/convertToGeoJson";
import SearchResults from "./components/SearchResults/SearchResults";
import AddCragPopup from "./components/AddCragForm/AddCragForm";
import useStore from "./store";
import Popup from "./components/Popup/Popup";
import AddRouteForm from "./components/AddRouteForm/AddRouteForm";

const App = () => {
  const [isAddCragPopupOpen, isAddRouteFormOpen] = useStore((state) => [state.isAddCragFormOpen, state.isAddRouteFormOpen]);

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
      {/* <CragMap geoData={data ? convertToGeoJson(data) : undefined} /> */}
      {isAddCragPopupOpen && <AddCragPopup />}
      {isAddRouteFormOpen && <AddRouteForm />}
      {/* <Popup /> */}
    </div>
  );
};

export default App;
