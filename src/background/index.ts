import { Storage } from "@plasmohq/storage"

import { LocalConfig, SyncConfig } from "~config/config"
import type {
  LocalConfigInterface,
  SyncConfigInterface
} from "~config/config-interface"

export {}

let localConfig: LocalConfigInterface
let cacheTime = 0
export const getLocalConfig = async () => {
  if (localConfig && Date.now() - cacheTime < 5 * 1000) return localConfig
  const storage = new Storage({
    area: "local"
  })
  cacheTime = Date.now()
  return (localConfig =
    (await storage.get(LocalConfig.key)) || LocalConfig.default)
}

let syncConfig: SyncConfigInterface
let syncCacheTime = 0
const getSyncConfig = async () => {
  if (syncConfig && Date.now() - syncCacheTime < 5 * 1000) return syncConfig
  const storage = new Storage()
  syncCacheTime = Date.now()
  return (syncConfig =
    (await storage.get(SyncConfig.key)) || SyncConfig.default)
}

export const getGestureMatchConfigCustomOptions = async () => {
  const syncConfig = await getSyncConfig()
  return (
    syncConfig?.gestureMatchConfig?.customOptions ||
    SyncConfig.default.gestureMatchConfig.customOptions
  )
}

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install" || details.reason === "update") {
    chrome.runtime.openOptionsPage()
  }
})
