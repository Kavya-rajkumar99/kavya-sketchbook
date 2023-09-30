import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { COLORS, MENU_ITEMS } from "@/constants";
import { changeColor, changeSize } from "@/slice/toolboxSlice";
import cx from "classnames";
import { socket } from "@/socket";

const Toolbox = () => {
  const dispatch = useDispatch();
  const activeMenuItem = useSelector((store) => store.menu.activeMenuItem);
  const { color, size } = useSelector((store) => store.toolbox[activeMenuItem]);
  const showStrokeToolOption = activeMenuItem === MENU_ITEMS.PENCIL;
  const showBrushToolOption =
    activeMenuItem === MENU_ITEMS.PENCIL ||
    activeMenuItem === MENU_ITEMS.ERASER;
  const changeBrushSize = (e) => {
    dispatch(changeSize({ item: activeMenuItem, size: e.target.value }));
    socket.emit("changeConfig", { color, size: e.target.value });
  };
  const updateColor = (newColor) => {
    dispatch(changeColor({ item: activeMenuItem, color: newColor }));
    socket.emit("changeConfig", { color: newColor, size });
  };
  return (
    <div className={styles.toolboxContainer}>
      {showStrokeToolOption && (
        <div className={styles.toolItem}>
          <h4 className={styles.toolText}>Stroke Colors</h4>
          <div
            className={styles.itemContainer}
            onClick={(e) => updateColor(e.target.id)}
          >
            <div
              className={cx(styles.colorBox, {
                [styles.active]: color === COLORS.BLACK,
              })}
              id={COLORS.BLACK}
              style={{ backgroundColor: COLORS.BLACK }}
            />
            <div
              className={cx(styles.colorBox, {
                [styles.active]: color === COLORS.RED,
              })}
              id={COLORS.RED}
              style={{ backgroundColor: COLORS.RED }}
            />
            <div
              className={cx(styles.colorBox, {
                [styles.active]: color === COLORS.GREEN,
              })}
              id={COLORS.GREEN}
              style={{ backgroundColor: COLORS.GREEN }}
            />
            <div
              className={cx(styles.colorBox, {
                [styles.active]: color === COLORS.BLUE,
              })}
              id={COLORS.BLUE}
              style={{ backgroundColor: COLORS.BLUE }}
            />
            <div
              className={cx(styles.colorBox, {
                [styles.active]: color === COLORS.ORANGE,
              })}
              id={COLORS.ORANGE}
              style={{ backgroundColor: COLORS.ORANGE }}
            />
            <div
              className={cx(styles.colorBox, {
                [styles.active]: color === COLORS.YELLOW,
              })}
              id={COLORS.YELLOW}
              style={{ backgroundColor: COLORS.YELLOW }}
            />
          </div>
        </div>
      )}
      {showBrushToolOption && (
        <div className={styles.toolItem}>
          <h4 className={styles.toolText}>Brush Size</h4>
          <div className={styles.itemContainer}>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              onChange={changeBrushSize}
              value={size}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default Toolbox;
