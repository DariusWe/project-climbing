import classes from "./Header.module.scss";

const Header = () => {
  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        {/* <img src="path/to/logo.png" alt="Logo" /> */}
        <span>ClimbingApp</span>
      </div>
      <nav>
        <ul>
          <li>
            <a href="#">Sign in</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
