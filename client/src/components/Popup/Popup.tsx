import { FC, ReactNode } from "react";
import classes from "./Popup.module.scss";

type PopupProps = {
    closeFn: () => void,
    children: ReactNode
}

const Popup: FC<PopupProps> = ({closeFn, children}) => {
  return (
    <div className={classes.popupModal}>
      <div className={classes.popupContainer}>
        <span className={classes.closeBtn} onClick={closeFn}>X</span>
        {children}
        </div>
    </div>
  );
};

export default Popup;
