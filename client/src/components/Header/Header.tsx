import classes from "./Header.module.scss";
import useStore from "../../store";
import UpdateCragImageBtn from "../UpdateCragImageBtn/UpdateCragImageBtn";

const Header = () => {
  const [addCragFormOpen, setAddCragFormOpen] = useStore((state) => [state.addCragFormOpen, state.setAddCragFormOpen]);

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
        {/* <UpdateCragImageBtn /> */}
        {!addCragFormOpen && <span className={classes.add} onClick={() => setAddCragFormOpen(true)}>Add +</span>}
        {addCragFormOpen && <span className={classes.add} onClick={() => setAddCragFormOpen(false)}>Map</span>}
        <a href="#">Sign in</a>
      </div>
    </header>
  );
};

export default Header;
