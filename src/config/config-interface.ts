import type { Point } from "~core/trajectory"

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

export interface SyncConfigInterface {
  strokeStyle: string
  lineWidth: number
  showTooltip: boolean
  tooltipStyle: object
}

export interface LocalConfigInterface {
  gesture: ConfigGesture[]
  drag_text: ConfigGesture[]
  drag_url: ConfigGesture[]
  drag_image: ConfigGesture[]
}
