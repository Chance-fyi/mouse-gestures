import {getConfig} from "~config";
import type {Point} from "~trajectory";
import {getPathDirections} from "~trajectory";
import {Operation} from "~operation";
import {Operations} from "~enum";

// Block right-click menu
let blockMenu: boolean = false;
const _ = require('lodash');
export const handleMouseDown = async (arg, e: MouseEvent) => {
  // Determine if it is a right-click press
  if (e.button != 2) {
    return;
  }

  const DefaultTooltipValue = {
    arrow: "",
    operation: Operations.Invalid,
  };
  arg.setTooltipValue(DefaultTooltipValue);
  arg.setCanvasVisible(true);
  const config = await getConfig();
  const threshold: number = 5;

  blockMenu = false;
  let X: number = e.clientX;
  let lastX: number = e.clientX;
  let Y: number = e.clientY;
  let lastY: number = e.clientY;
  let points: Point[] = [{x: X, y: Y}];
  let gesture: string = "";
  const handleMouseMove = (e: MouseEvent) => {
    if (config.enableGestureCue && (Math.abs(X - e.clientX) > threshold || Math.abs(Y - e.clientY) > threshold)) {
      arg.setTooltipVisible(true);
    }
    const currentX: number = e.clientX;
    const currentY: number = e.clientY;
    arg.canvasCtx.beginPath();
    arg.canvasCtx.moveTo(lastX, lastY);
    // Using Bessel curves to smooth trajectories
    arg.canvasCtx.quadraticCurveTo(
      (lastX + currentX) / 2,
      (lastY + currentY) / 2,
      currentX,
      currentY
    );
    arg.canvasCtx.strokeStyle = config.strokeStyle;
    arg.canvasCtx.lineWidth = config.lineWidth;
    arg.canvasCtx.stroke();
    arg.canvasCtx.closePath();
    lastX = currentX;
    lastY = currentY;
    points.push({x: currentX, y: currentY});
    gesture = _.join(getPathDirections(points), "");
    if (_.has(config.gestures, gesture)) {
      arg.setTooltipValue({
        arrow: config.arrows[gesture],
        operation: config.gestures[gesture],
      });
    } else {
      arg.setTooltipValue(DefaultTooltipValue);
    }
  };
  const handleMouseUp = (e: MouseEvent) => {
    arg.canvasCtx.clearRect(0, 0, arg.canvasCtx.canvas.width, arg.canvasCtx.canvas.height);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    arg.setCanvasVisible(false);
    arg.setTooltipVisible(false);
    if (Math.abs(X - e.clientX) > threshold || Math.abs(Y - e.clientY) > threshold) {
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



