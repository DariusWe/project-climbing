import classes from "./App.module.scss";
import Header from "./components/Header/Header";
import Map from "./components/Map/Map";

const App = () => {
  return (
    <div className={classes.app}>
      <Header />
      <Map />
    </div>
  );
};

export default App;
