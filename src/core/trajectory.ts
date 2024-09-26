export interface Point {
  x: number;
  y: number;
}


export class Trajectory {
  public static old: Point[] = [];
  public static trajectory: Point[] = [];

  public static addPoint(point: Point) {
    this.trajectory.push(point);
  }

  public static clear() {
    this.old = this.trajectory;
    this.trajectory = [];
  }

  public static simplify(distanceThreshold: number, angleThreshold: number): Point[] {
    if (this.trajectory.length < 3) return this.trajectory;

    let simplifiedPoints: Point[] = [this.trajectory[0]];

    for (let i = 1; i < this.trajectory.length - 1; i++) {
      const prevPoint = simplifiedPoints[simplifiedPoints.length - 1];
      const currentPoint = this.trajectory[i];
      const nextPoint = this.trajectory[i + 1];

      if (this.distance(prevPoint, currentPoint) >= distanceThreshold &&
        this.angle(prevPoint, currentPoint, nextPoint) >= angleThreshold) {
        simplifiedPoints.push(currentPoint);
      }
    }

    simplifiedPoints.push(this.trajectory[this.trajectory.length - 1]);

    return simplifiedPoints;
  }

  // 计算两点之间的欧几里得距离
  private static distance(p1: Point, p2: Point): number {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y);
  }

  // 计算向量的角度
  private static angle(p1: Point, p2: Point, p3: Point): number {
    const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
    const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
    const dotProduct = v1.x * v2.x + v1.y * v2.y;
    const magnitudeV1 = Math.hypot(v1.x, v1.y);
    const magnitudeV2 = Math.hypot(v2.x, v2.y);
    return Math.acos(dotProduct / (magnitudeV1 * magnitudeV2)) * (180 / Math.PI);
  }

  // 动态时间规整（DTW）算法
  public static dtw(trajectory1: Point[], trajectory2: Point[]): number {
    const n = trajectory1.length;
    const m = trajectory2.length;
    const dtwMatrix: number[][] = Array.from({length: n + 1}, () => Array(m + 1).fill(Infinity));

    dtwMatrix[0][0] = 0;

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        const cost = this.euclideanDistance(trajectory1[i - 1], trajectory2[j - 1]);
        dtwMatrix[i][j] = cost + Math.min(dtwMatrix[i - 1][j], dtwMatrix[i][j - 1], dtwMatrix[i - 1][j - 1]);
      }
    }

    return dtwMatrix[n][m];
  }

  // 计算欧氏距离
  private static euclideanDistance(p1: Point, p2: Point): number {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  }
}