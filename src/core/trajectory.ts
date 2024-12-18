export interface Point {
  x: number
  y: number
}

interface Vector {
  x: number
  y: number
  angle: number
  distance: number
}

interface MatchResult {
  isMatched: boolean
  similarity: number
}

export class Trajectory {
  public static trajectory: Point[] = []

  public static addPoint(point: Point) {
    this.trajectory.push(point)
  }

  public static delPoint() {
    this.trajectory.pop()
  }

  public static clear() {
    this.trajectory = []
  }

  // Simplifying trajectories using the Douglas-Peucker algorithm
  public static simplifyTrajectory(
    points: Point[],
    tolerance: number = 10
  ): Point[] {
    if (points.length <= 2) return points

    let maxDistance = 0
    let maxIndex = 0

    // Find the point furthest from the first and last line segments
    for (let i = 1; i < points.length - 1; i++) {
      const distance = this.getPointToLineDistance(
        points[i],
        points[0],
        points[points.length - 1]
      )
      if (distance > maxDistance) {
        maxDistance = distance
        maxIndex = i
      }
    }

    // If the maximum distance is less than the tolerance, then return directly to the first and last points
    if (maxDistance <= tolerance) {
      return [points[0], points[points.length - 1]]
    }

    // Recursively simplify the before and after
    const firstHalf = this.simplifyTrajectory(
      points.slice(0, maxIndex + 1),
      tolerance
    )
    const secondHalf = this.simplifyTrajectory(
      points.slice(maxIndex),
      tolerance
    )

    // Merge results to remove duplicate points
    return firstHalf.slice(0, -1).concat(secondHalf)
  }

  // Calculate the distance from the point to the line segment
  private static getPointToLineDistance(
    point: Point,
    lineStart: Point,
    lineEnd: Point
  ): number {
    const A = point.x - lineStart.x
    const B = point.y - lineStart.y
    const C = lineEnd.x - lineStart.x
    const D = lineEnd.y - lineStart.y

    const dot = A * C + B * D
    const lenSq = C * C + D * D
    let param = -1

    if (lenSq !== 0) {
      param = dot / lenSq
    }

    let xx: number, yy: number

    if (param < 0) {
      xx = lineStart.x
      yy = lineStart.y
    } else if (param > 1) {
      xx = lineEnd.x
      yy = lineEnd.y
    } else {
      xx = lineStart.x + param * C
      yy = lineStart.y + param * D
    }

    return this.getDistance(point, { x: xx, y: yy })
  }

  // Calculate the distance between two points
  private static getDistance(p1: Point, p2: Point): number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
  }

  // -----------------------------------------------------Match---------------------------------------------------------

  // computational vector
  private static getVector(start: Point, end: Point): Vector {
    const x = end.x - start.x
    const y = end.y - start.y
    const distance = this.getDistance(start, end)
    const angle = Math.atan2(y, x)
    return { x, y, angle, distance }
  }

  // Calculate the angular difference (between -π and π)
  private static getAngleDifference(angle1: number, angle2: number): number {
    let diff = angle2 - angle1
    while (diff > Math.PI) diff -= 2 * Math.PI
    while (diff < -Math.PI) diff += 2 * Math.PI
    return diff
  }

  // Extract key feature points of the trajectory
  private static extractKeyPoints(
    points: Point[],
    options: {
      minAngleChange: number // Minimum Angle Change
      minSegmentLength: number // Minimum line length
    }
  ): Point[] {
    if (points.length <= 2) return points

    const result: Point[] = [points[0]]
    let currentDirection = this.getVector(points[0], points[1]).angle
    let accumulatedAngleChange = 0
    let lastKeyPoint = points[0]

    for (let i = 1; i < points.length - 1; i++) {
      const v1 = this.getVector(points[i], points[i + 1])
      const angleChange = Math.abs(
        this.getAngleDifference(currentDirection, v1.angle)
      )
      accumulatedAngleChange += angleChange

      const distanceFromLast = this.getDistance(lastKeyPoint, points[i])

      // Adding keypoints when the cumulative angle change exceeds a threshold or is far enough away
      if (
        accumulatedAngleChange > options.minAngleChange ||
        distanceFromLast > options.minSegmentLength
      ) {
        result.push(points[i])
        lastKeyPoint = points[i]
        accumulatedAngleChange = 0
        currentDirection = v1.angle
      }
    }

    result.push(points[points.length - 1])
    return result
  }

  // Calculate trajectory characteristics
  private static getTrajectoryFeatures(points: Point[]): {
    totalDistance: number
    overallDirection: number
    segmentDirections: number[]
    keyPoints: Point[]
  } {
    const keyPoints = this.extractKeyPoints(points, {
      minAngleChange: Math.PI / 6,
      minSegmentLength:
        this.getDistance(points[0], points[points.length - 1]) * 0.1
    })

    let totalDistance = 0
    const segmentDirections: number[] = []

    for (let i = 0; i < keyPoints.length - 1; i++) {
      const vector = this.getVector(keyPoints[i], keyPoints[i + 1])
      totalDistance += vector.distance
      segmentDirections.push(vector.angle)
    }

    const overallDirection = this.getVector(
      points[0],
      points[points.length - 1]
    ).angle

    return {
      totalDistance,
      overallDirection,
      segmentDirections,
      keyPoints
    }
  }

  // Compare two trajectories for matching
  public static matchTrajectories(
    trajectory1: Point[],
    trajectory2: Point[],
    options = {
      angleThreshold: Math.PI / 6, // 30 degree angle tolerance
      similarityThreshold: 0.8 // similarity threshold
    }
  ): MatchResult {
    // Getting the features of two trajectories
    const features1 = this.getTrajectoryFeatures(trajectory1)
    const features2 = this.getTrajectoryFeatures(trajectory2)

    // Check overall orientation
    const overallAngleDiff = Math.abs(
      this.getAngleDifference(
        features1.overallDirection,
        features2.overallDirection
      )
    )
    if (overallAngleDiff > options.angleThreshold) {
      return {
        isMatched: false,
        similarity: 0
      }
    }

    const result = this.matchComplexShape(trajectory1, trajectory2, options)
    if (result.isMatched) return result

    // Calculate the similarity of key segment directions
    const directions1 = features1.segmentDirections
    const directions2 = features2.segmentDirections

    // Dynamic programming calculates the best match
    const dp: number[][] = Array(directions1.length + 1)
      .fill(0)
      .map(() => Array(directions2.length + 1).fill(0))

    // Populating the DP table
    for (let i = 1; i <= directions1.length; i++) {
      for (let j = 1; j <= directions2.length; j++) {
        const angleDiff = Math.abs(
          this.getAngleDifference(directions1[i - 1], directions2[j - 1])
        )
        const score = angleDiff <= options.angleThreshold ? 1 : 0
        dp[i][j] = Math.max(
          dp[i - 1][j],
          dp[i][j - 1],
          dp[i - 1][j - 1] + score
        )
      }
    }

    const maxMatches = dp[directions1.length][directions2.length]
    const maxPossibleMatches = Math.max(directions1.length, directions2.length)
    const similarity =
      maxPossibleMatches > 0 ? maxMatches / maxPossibleMatches : 0

    return {
      isMatched: similarity >= options.similarityThreshold,
      similarity
    }
  }

  // Calculate shape centre point
  private static getCentroid(points: Point[]): Point {
    let sumX = 0,
      sumY = 0
    for (const p of points) {
      sumX += p.x
      sumY += p.y
    }
    return {
      x: sumX / points.length,
      y: sumY / points.length
    }
  }

  // Normalisation of point sets
  private static normalizePoints(points: Point[]): Point[] {
    const center = this.getCentroid(points)

    // Calculate maximum distance for scaling
    let maxDist = 0
    for (const p of points) {
      const dist = this.getDistance(center, p)
      maxDist = Math.max(maxDist, dist)
    }

    // Normalised to the unit circle
    return points.map((p) => ({
      x: (p.x - center.x) / maxDist,
      y: (p.y - center.y) / maxDist
    }))
  }

  // Characterisation of computational shapes
  private static getShapeDescriptor(points: Point[]): {
    turningAngles: number[] // corner sequence
    radialDistances: number[] // Radial Distance Sequence
    edgeLengths: number[] // sequence of side lengths
  } {
    const normalized = this.normalizePoints(points)
    const center = this.getCentroid(normalized)

    const turningAngles: number[] = []
    const radialDistances: number[] = []
    const edgeLengths: number[] = []

    // Calculate the sequence of features
    for (let i = 0; i < normalized.length - 1; i++) {
      // Calculating Corners
      if (i < normalized.length - 2) {
        const v1 = this.getVector(normalized[i], normalized[i + 1])
        const v2 = this.getVector(normalized[i + 1], normalized[i + 2])
        turningAngles.push(this.getAngleDifference(v1.angle, v2.angle))
      }

      // Calculate the distance to the centre
      radialDistances.push(this.getDistance(center, normalized[i]))

      // Calculate side lengths
      edgeLengths.push(this.getDistance(normalized[i], normalized[i + 1]))
    }

    // Add the radial distance of the last point
    radialDistances.push(
      this.getDistance(center, normalized[normalized.length - 1])
    )

    return {
      turningAngles,
      radialDistances,
      edgeLengths
    }
  }

  // Calculate the sequence similarity
  private static getSequenceSimilarity(seq1: number[], seq2: number[]): number {
    const len1 = seq1.length
    const len2 = seq2.length

    // Finding the best match using dynamic programming
    const dp: number[][] = Array(len1 + 1)
      .fill(0)
      .map(() => Array(len2 + 1).fill(0))

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const diff = Math.abs(seq1[i - 1] - seq2[j - 1])
        const similarity = Math.exp(-diff * diff) // Gaussian similarity
        dp[i][j] = Math.max(
          dp[i - 1][j],
          dp[i][j - 1],
          dp[i - 1][j - 1] + similarity
        )
      }
    }

    const maxScore = dp[len1][len2]
    const maxPossible = Math.max(len1, len2)
    return maxScore / maxPossible
  }

  private static matchComplexShape(
    trajectory1: Point[],
    trajectory2: Point[],
    options = {
      angleThreshold: Math.PI / 6,
      similarityThreshold: 0.8
    }
  ): MatchResult {
    // Get shape description
    const desc1 = this.getShapeDescriptor(trajectory1)
    const desc2 = this.getShapeDescriptor(trajectory2)

    // Calculate the similarity of each feature
    const turningSimilarity = this.getSequenceSimilarity(
      desc1.turningAngles,
      desc2.turningAngles
    )

    const radialSimilarity = this.getSequenceSimilarity(
      desc1.radialDistances,
      desc2.radialDistances
    )

    const edgeSimilarity = this.getSequenceSimilarity(
      desc1.edgeLengths,
      desc2.edgeLengths
    )

    // Combined similarity (weights can be adjusted)
    const similarity =
      0.4 * turningSimilarity + 0.3 * radialSimilarity + 0.3 * edgeSimilarity

    return {
      isMatched: similarity >= options.similarityThreshold,
      similarity
    }
  }
}
