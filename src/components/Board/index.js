import { useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionMenuItemClick } from "@/slice/menuSlice";
import { MENU_ITEMS } from "@/constants";

const Board = () => {
  const dispatch = useDispatch();
  const { activeMenuItem, actionMenuItem } = useSelector((store) => store.menu);
  const { color, size } = useSelector((store) => store.toolbox[activeMenuItem]);
  const canvasRef = useRef(null);
  const shouldDraw = useRef(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    if (actionMenuItem === MENU_ITEMS.DOWNLOAD) {
      const URL = canvas.toDataURL();
      const anchorEl = document.createElement("a");
      anchorEl.href = URL;
      anchorEl.download = "sketch.png";
      anchorEl.click();
      dispatch(actionMenuItemClick(null));
    }
  }, [actionMenuItem, dispatch]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const setConfig = () => {
      context.strokeStyle = color;
      context.lineWidth = size;
    };
    setConfig();
  }, [color, size]);

  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const beginPath = (x, y) => {
      context.beginPath();
      context.moveTo(x, y);
    };
    const drawPath = (x, y) => {
      context.lineTo(x, y);
      context.stroke();
    };
    const handleMouseDown = (e) => {
      shouldDraw.current = true;
      beginPath(e.clientX, e.clientY);
    };
    const handleMouseMove = (e) => {
      if (!shouldDraw.current) return;
      drawPath(e.clientX, e.clientY);
    };
    const handleMouseUp = () => {
      shouldDraw.current = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default Board;
