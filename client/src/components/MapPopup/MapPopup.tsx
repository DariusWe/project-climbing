import { FC } from "react";
import classes from "./MapPopup.module.scss";

type MapPopupProps = {
  name: string;
  description: string;
  imgUrl: string;
};

const MapPopup: FC<MapPopupProps> = ({ name, description, imgUrl }) => {
    console.log(imgUrl);
  return (
    <div className={classes.mapPopup}>
      <img src={imgUrl} alt="Image of Crag" />
      <div className={classes.bottomSide}>
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default MapPopup;
