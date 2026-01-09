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
        minSimilarity: 0.7, // Lower similarity threshold
        keyPointOptions: {
          minAngleChange: Math.PI / 6, // 30-degree turn before recording
          minSegmentRatio: 0.2 // Focus on major moving segments
        },
        turnCountPenalty: 0.2
      }
    )
    if (result.isMatched && result.similarity > similarity) {
      similarity = result.similarity
      uniqueKey = gesture.uniqueKey
    }
  }
  return uniqueKey
}

export const requestPermissions = (permissions = []): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!permissions || permissions.length === 0) {
      resolve(true)
      return
    }

    chrome.permissions.contains({ permissions }, (has) => {
      if (has) {
        resolve(true)
        return
      }

      chrome.permissions.request({ permissions }, (granted) => {
        resolve(Boolean(granted))
      })
    })
  })
}
