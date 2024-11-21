import type {
  LocalConfigInterface,
  SyncConfigInterface
} from "~config/config-interface"

export class SyncConfig {
  public static readonly key: string = "sync-config"
  public static default: SyncConfigInterface = {
    strokeStyle: "#00d7c0",
    lineWidth: 6
  }
}

export class LocalConfig {
  public static readonly key: string = "local-config"
  public static default: LocalConfigInterface = {
    gesture: []
  }
}
