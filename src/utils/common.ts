import type { ConfigGesture } from "~config/config-interface"
import { Trajectory, type Point } from "~core/trajectory"

export const i18n = (key: string = ""): string => {
  return chrome.i18n.getMessage(key)
}

export const matchGesture = (
  trajectory: Point[],
  gestures: ConfigGesture[]
): string => {
  let similarity = 0
  let uniqueKey = ""

  for (const gesture of gestures) {
    const result = Trajectory.matchTrajectories(
      trajectory,
      gesture.trajectory,
      {
        angleThreshold: Math.PI / 3, // 60 degree large angle tolerance
        lengthTolerance: 0.5, // 50% length variance allowed
        minSimilarity: 0.65, // Lower similarity threshold
        keyPointOptions: {
          minAngleChange: Math.PI / 6, // 30-degree turn before recording
          minSegmentRatio: 0.2 // Focus on major moving segments
        }
      }
    )
    if (result.isMatched && result.similarity > similarity) {
      similarity = result.similarity
      uniqueKey = gesture.uniqueKey
    }
  }
  return uniqueKey
}
