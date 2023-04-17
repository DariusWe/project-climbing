import { FC } from "react";
import classes from "./MapboxPopup.module.scss";
import NoImageAvailable from "../../assets/noimageavailable.png";

type MapboxPopupProps = {
  name: string;
  imgUrl: string;
};

const MapboxPopup: FC<MapboxPopupProps> = ({ name, imgUrl }) => {
  return (
    <div className={classes.mapboxPopup}>
      <div className={classes.popupImg} style={{ backgroundImage: `url(${imgUrl}), url(${NoImageAvailable})` }} />
      <div className={classes.bottomSide}>
        <h3>{name}</h3>
        <div className={classes.info} />
      </div>
    </div>
  );
};

export default MapboxPopup;
