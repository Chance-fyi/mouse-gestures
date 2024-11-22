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
    const result = Trajectory.matchTrajectories(trajectory, gesture.trajectory)
    if (result.isMatched && result.similarity > similarity) {
      similarity = result.similarity
      uniqueKey = gesture.uniqueKey
    }
  }
  return uniqueKey
}
