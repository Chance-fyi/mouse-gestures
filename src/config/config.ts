import type { ConfigInterface } from "~config/config-interface"

export class Config {
  public static readonly key: string = "config"
  public static default: ConfigInterface = {
    strokeStyle: "#0072f3",
    lineWidth: 6,
    lineWidth1: 111116,
    gesture: []
  }
}
