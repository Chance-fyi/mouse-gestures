import type { Point } from "~core/trajectory"

export type ConfigGesture = {
  uniqueKey: string
  name: string
  trajectory: Point[]
  command: {
    uniqueKey: string
    name: string
    config: { [key: string]: string | number }
  }
}

export interface ConfigInterface {
  strokeStyle: string
  lineWidth: number
  lineWidth1: number
  gesture: ConfigGesture[]
}
