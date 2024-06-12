import {getConfig} from "~config";
import type {Point} from "~trajectory";
import {getPathDirections} from "~trajectory";
import {Operation} from "~operation";

// Block right-click menu
let blockMenu: boolean = false;
const _ = require('lodash');
export const handleMouseDown = async (setCanvasVisible, canvasCtx, setTooltipVisible, setTooltipValue, e: MouseEvent) => {
  // Determine if it is a right-click press
  if (e.button != 2) {
    return;
  }
  setCanvasVisible(true);
  const config = await getConfig();
  if (config.enableGestureCue) {
    setTooltipVisible(true);
  }

  blockMenu = false;
  let X: number = e.clientX;
  let lastX: number = e.clientX;
  let Y: number = e.clientY;
  let lastY: number = e.clientY;
  let points: Point[] = [{x: X, y: Y}];
  let gesture: string = "";
  const handleMouseMove = (e: MouseEvent) => {
    const currentX: number = e.clientX;
    const currentY: number = e.clientY;
    canvasCtx.beginPath();
    canvasCtx.moveTo(lastX, lastY);
    // Using Bessel curves to smooth trajectories
    canvasCtx.quadraticCurveTo(
      (lastX + currentX) / 2,
      (lastY + currentY) / 2,
      currentX,
      currentY
    );
    canvasCtx.strokeStyle = config.strokeStyle;
    canvasCtx.lineWidth = config.lineWidth;
    canvasCtx.stroke();
    canvasCtx.closePath();
    lastX = currentX;
    lastY = currentY;
    points.push({x: currentX, y: currentY});
    gesture = _.join(getPathDirections(points), "");
    if (_.has(config.gestures, gesture)) {
      setTooltipValue({
        arrow: config.arrows[gesture],
        operation: config.gestures[gesture],
      });
    }
  };
  const handleMouseUp = (e: MouseEvent) => {
    canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    setCanvasVisible(false);
    setTooltipVisible(false);
    if (X != e.clientX || Y != e.clientY) {
      // Mouseover prevents right-click menu
      blockMenu = true;
    }
    if (_.has(config.gestures, gesture)) {
      const operation = new Operation();
      operation[config.gestures[gesture]]();
    }
  }

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};

document.addEventListener("contextmenu", (e: MouseEvent) => {
  if (blockMenu) {
    // Block right-click menu
    e.preventDefault();
  }
});



