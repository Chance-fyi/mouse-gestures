import { Storage } from "@plasmohq/storage"

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

export const Backup = async () => {
  const syncConfig = await new Storage().get(SyncConfig.key)
  const localConfig = await new Storage({ area: "local" }).get(LocalConfig.key)

  const manifest = chrome.runtime.getManifest()
  const data = {
    version: manifest.version,
    syncConfig,
    localConfig
  }

  const jsonStr = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonStr], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = [
    manifest.name,
    " ",
    manifest.version,
    " ",
    new Date().toISOString().split("T")[0],
    ".json"
  ].join("")
  a.click()
  URL.revokeObjectURL(url)
}

export const Restore = async (jsonStr: string) => {
  const config = JSON.parse(jsonStr)
  await new Storage().set(SyncConfig.key, {
    ...SyncConfig.default,
    ...config?.syncConfig
  })
  await new Storage({ area: "local" }).set(LocalConfig.key, {
    ...LocalConfig.default,
    ...config?.localConfig
  })
}

export const Reset = async () => {
  await new Storage().set(SyncConfig.key, SyncConfig.default)
  await new Storage({ area: "local" }).set(LocalConfig.key, LocalConfig.default)
}
