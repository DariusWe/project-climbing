import classes from "./Header.module.scss";
import useStore from "../../store";

const Header = () => {
  const [addCragPopupOpen, setAddCragPopupOpen] = useStore((state) => [state.addCragPopupOpen, state.setAddCragPopupOpen]);

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
        {!addCragPopupOpen && <span className={classes.add} onClick={() => setAddCragPopupOpen(true)}>Add +</span>}
        {addCragPopupOpen && <span className={classes.add} onClick={() => setAddCragPopupOpen(false)}>Map</span>}
        <a href="#">Sign in</a>
      </div>
    </header>
  );
};

export default Header;
