import { FC } from "react";
import classes from "./MapPopup.module.scss";
import NoImageAvailable from "../../assets/noimageavailable.png";

type MapPopupProps = {
  name: string;
  imgUrl: string;
};

const MapPopup: FC<MapPopupProps> = ({ name, imgUrl }) => {
  return (
    <div className={classes.mapPopup}>
      <div className={classes.popupImg} style={{ backgroundImage: `url(${imgUrl}), url(${NoImageAvailable})` }} />
      <div className={classes.bottomSide}>
        <h3>{name}</h3>
        <div className={classes.info} />
      </div>
    </div>
  );
};

export default MapPopup;
