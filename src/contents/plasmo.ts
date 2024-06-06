import type {PlasmoCSConfig} from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
}

interface Point {
  x: number;
  y: number;
}

// 是否阻止右键菜单
let blockMenu: boolean = false;
document.addEventListener("mousedown", (e: MouseEvent) => {
  // 判断是否是右键按下
  if (e.button != 2) {
    return;
  }
  blockMenu = false;
  // 鼠标初始位置
  let clientX: number = e.clientX;
  let clientY: number = e.clientY;

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "999999";
  canvas.style.pointerEvents = "none"; // 点击穿透
  canvas.width = window.innerWidth - 1; // -1 防止出现滚动条
  canvas.height = window.innerHeight - 1;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  if (!ctx) return;
  ctx.strokeStyle = "#0072f3";
  ctx.lineWidth = 2;

  let lastX: number = e.clientX;
  let lastY: number = e.clientY;

  let points: Point[] = [{x: clientX, y: clientY}];
  const handleMouseMove = (moveEvent: MouseEvent) => {
    const currentX: number = moveEvent.clientX;
    const currentY: number = moveEvent.clientY;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    // 使用贝塞尔曲线来平滑轨迹
    ctx.quadraticCurveTo(
      (lastX + currentX) / 2,
      (lastY + currentY) / 2,
      currentX,
      currentY
    );
    ctx.stroke();

    lastX = currentX;
    lastY = currentY;

    points.push({x: lastX, y: lastY});
    console.log(getTrajectory(points))
  };

  const handleMouseUp = (e: MouseEvent) => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.body.removeChild(canvas);
    if (clientX != e.clientX || clientY != e.clientY) {
      // 鼠标移动阻止右键菜单
      blockMenu = true;
    }
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
});
document.addEventListener("contextmenu", (e: MouseEvent) => {
  if (blockMenu) {
    // 阻止右键菜单
    e.preventDefault();
  }
});

enum Direction {
  Up = "Up",
  Down = "Down",
  Left = "Left",
  Right = "Right"
}

function getDirection(from: Point, to: Point): Direction {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? Direction.Right : Direction.Left;
  } else {
    return dy > 0 ? Direction.Down : Direction.Up;
  }
}

function getTrajectory(points: Point[], windowSize: number = 5): Direction[] {
  if (points.length < windowSize) {
    return [];
  }

  const trajectory: Direction[] = [];
  let currentDirection = getDirection(points[0], points[Math.min(windowSize, points.length - 1)]);
  trajectory.push(currentDirection);

  for (let i = windowSize; i < points.length; i += windowSize) {
    const newDirection = getDirection(points[i - windowSize], points[Math.min(i, points.length - 1)]);
    if (newDirection !== currentDirection) {
      trajectory.push(newDirection);
      currentDirection = newDirection;
    }
  }

  // Check the last segment if it's not exactly divisible by windowSize
  if (points.length % windowSize !== 0) {
    const lastDirection = getDirection(points[points.length - points.length % windowSize - 1], points[points.length - 1]);
    if (lastDirection !== currentDirection) {
      trajectory.push(lastDirection);
    }
  }

  return trajectory;
}