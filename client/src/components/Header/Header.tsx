import classes from "./Header.module.scss";
import useStore from "../../store";

const Header = () => {
  const [mapMode, updateMapMode] = useStore((state) => [state.mapMode, state.updateMapMode]);

  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        {/* <img src="path/to/logo.png" alt="Logo" /> */}
        <span>CragFinder</span>
      </div>
      <div className={classes.searchbar}>
        <span>Search for locations, crags, routes ...</span>
      </div>
      <div className={classes.filter}>
        <span>Filter ...</span>
      </div>
      <div className={classes.rightSide}>
        {mapMode === "search" && <span className={classes.add} onClick={() => updateMapMode("setCoordinates")}>Add +</span>}
        {mapMode === "setCoordinates" && <span className={classes.add} onClick={() => updateMapMode("search")}>Map</span>}
        <a href="#">Sign in</a>
      </div>
    </header>
  );
};

export default Header;
