import {Direction} from "~enum";

export type Point = { x: number, y: number };

// 计算两点间的距离
const distance = (p1: Point, p2: Point): number => {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

// 平滑轨迹，减少抖动
const smoothPath = (points: Point[], threshold: number = 5): Point[] => {
  if (points.length < 2) return points;

  let smoothedPoints: Point[] = [points[0]];
  let lastPoint = points[0];

  for (let i = 1; i < points.length; i++) {
    if (distance(lastPoint, points[i]) > threshold) {
      smoothedPoints.push(points[i]);
      lastPoint = points[i];
    }
  }

  return smoothedPoints;
}

// 判断方向
const getDirection = (points: Point[]): string => {
  if (points.length < 2) return "No movement";

  let deltaX = points[points.length - 1].x - points[0].x;
  let deltaY = points[points.length - 1].y - points[0].y;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    return deltaX > 0 ? Direction.Right : Direction.Left;
  } else {
    return deltaY > 0 ? Direction.Down : Direction.Up;
  }
}

// 结合方向和转折点
export const getPathDirections = (points: Point[]): string[] => {
  const directions: string[] = [];
  const smoothedPoints = smoothPath(points);

  for (let i = 1; i < smoothedPoints.length; i++) {
    const direction = getDirection([smoothedPoints[i - 1], smoothedPoints[i]]);
    if (directions.length === 0 || directions[directions.length - 1] !== direction) {
      directions.push(direction);
    }
  }

  return directions;
}

