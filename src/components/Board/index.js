import { useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionMenuItemClick } from "@/slice/menuSlice";
import { MENU_ITEMS } from "@/constants";
import { socket } from "@/socket";

const Board = () => {
  const dispatch = useDispatch();
  const { activeMenuItem, actionMenuItem } = useSelector((store) => store.menu);
  const { color, size } = useSelector((store) => store.toolbox[activeMenuItem]);
  const canvasRef = useRef(null);
  const shouldDraw = useRef(false);
  const drawHistory = useRef([]);
  const historyPointer = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (actionMenuItem === MENU_ITEMS.DOWNLOAD) {
      const URL = canvas.toDataURL();
      const anchorEl = document.createElement("a");
      anchorEl.href = URL;
      anchorEl.download = "sketch.png";
      anchorEl.click();
    } else if (
      actionMenuItem === MENU_ITEMS.UNDO ||
      actionMenuItem === MENU_ITEMS.REDO
    ) {
      if (historyPointer.current > 0 && actionMenuItem === MENU_ITEMS.UNDO) {
        historyPointer.current--;
        context.putImageData(drawHistory.current[historyPointer.current], 0, 0);
      }
      if (
        historyPointer.current < drawHistory.current.length - 1 &&
        actionMenuItem === MENU_ITEMS.REDO
      ) {
        historyPointer.current++;
        context.putImageData(drawHistory.current[historyPointer.current], 0, 0);
      }
    }
    dispatch(actionMenuItemClick(null));
  }, [actionMenuItem, dispatch]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const setConfig = (color, size) => {
      context.strokeStyle = color;
      context.lineWidth = size;
    };
    setConfig(color, size);
    const handleChangeConfig = (config) => {
      setConfig(config.color, config.size);
    };
    socket.on("changeConfig", handleChangeConfig);
    return () => {
      socket.off("changeConfig", handleChangeConfig);
    };
  }, [color, size]);

  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });
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
      socket.emit("beginPath", { x: e.clientX, y: e.clientY });
    };
    const handleMouseMove = (e) => {
      if (!shouldDraw.current) return;
      drawPath(e.clientX, e.clientY);
      socket.emit("drawPath", { x: e.clientX, y: e.clientY });
    };
    const handleMouseUp = () => {
      shouldDraw.current = false;
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      drawHistory.current.push(imageData);
      historyPointer.current = drawHistory.current.length - 1;
    };
    const handleBeginPath = (path) => {
      beginPath(path.x, path.y);
    };
    const handleDrawPath = (path) => {
      drawPath(path.x, path.y);
    };
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    socket.on("beginPath", handleBeginPath);
    socket.on("drawPath", handleDrawPath);
    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      socket.off("beginPath", handleBeginPath);
      socket.off("drawPath", handleDrawPath);
    };
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default Board;
