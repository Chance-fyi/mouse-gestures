import type { Point } from "~core/trajectory"
import type { GestureStrictness } from "~enum/config"

export type ConfigGesture = {
  uniqueKey: string
  name: string
  trajectory: Point[]
  command: {
    uniqueKey: string
    name: string
    config: { [key: string]: string | number | boolean }
  }
}

export type GestureMatchConfigCustomOptions = {
  angleThreshold: number
  lengthTolerance: number
  minSimilarity: number
}

export interface SyncConfigInterface {
  strokeStyle: string
  lineWidth: number
  showTooltip: boolean
  showTrajectory: boolean
  tooltipStyle: object
  gestureMatchConfig: {
    strictness: GestureStrictness
    customOptions: GestureMatchConfigCustomOptions
  }
}

export interface LocalConfigInterface {
  gesture: ConfigGesture[]
  drag_text: ConfigGesture[]
  drag_url: ConfigGesture[]
  drag_image: ConfigGesture[]
}
