import type {
  LocalConfigInterface,
  SyncConfigInterface
} from "~config/config-interface"

export class SyncConfig {
  public static readonly key: string = "sync-config"
  public static default: SyncConfigInterface = {
    strokeStyle: "#2b3440",
    lineWidth: 10,
    showTooltip: true
  }
}

export class LocalConfig {
  public static readonly key: string = "local-config"
  public static default: LocalConfigInterface = {
    gesture: [],
    drag_text: [],
    drag_url: [],
    drag_image: []
  }
}
