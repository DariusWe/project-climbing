import classes from "./Header.module.scss";
import useStore from "../../store";
import { useState } from "react";
import UpdateCragImageBtn from "../UpdateCragImageBtn/UpdateCragImageBtn";

const Header = () => {
  const [setIsAddCragFormOpen, setIsAddRouteFormOpen] = useStore((state) => [state.setIsAddCragFormOpen, state.setIsAddRouteFormOpen]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    isDropdownOpen ? setIsDropdownOpen(false) : setIsDropdownOpen(true);
  };

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
        <span className={classes.add} onClick={toggleDropdown}>
          Add<i className="fa-solid fa-angle-down"></i>
        </span>
        {isDropdownOpen && (
          <div className={classes.dropdownMenu} onClick={() => {setIsDropdownOpen(false)}}>
            <span onClick={() => setIsAddCragFormOpen(true)}>Crag</span>
            <span onClick={() => setIsAddRouteFormOpen(true)}>Route</span>
          </div>
        )}
        <a href="#">Sign in</a>
      </div>
    </header>
  );
};

export default Header;
