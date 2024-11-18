import type { Point } from "~core/trajectory"

export type ConfigGesture = {
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
  gesture?: [ConfigGesture]
}

export const DefaultConfig: ConfigInterface = {
  strokeStyle: "#0072f3",
  lineWidth: 6
}
