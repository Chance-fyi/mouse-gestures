import { Storage } from "@plasmohq/storage"

import {
  LocalConfig,
  SyncConfig,
  sanitizeGestureMatchConfigCustomOptions
} from "~config/config"
import type {
  GestureMatchConfigCustomOptions,
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
let sanitizedGestureMatchConfigCustomOptions: GestureMatchConfigCustomOptions
let syncCacheTime = 0
const getSyncConfig = async () => {
  if (syncConfig && Date.now() - syncCacheTime < 5 * 1000) return syncConfig
  const storage = new Storage()
  syncCacheTime = Date.now()
  syncConfig = (await storage.get(SyncConfig.key)) || SyncConfig.default
  sanitizedGestureMatchConfigCustomOptions =
    sanitizeGestureMatchConfigCustomOptions(
      syncConfig?.gestureMatchConfig?.customOptions
    )
  return syncConfig
}

export const getGestureMatchConfigCustomOptions = async () => {
  await getSyncConfig()
  return sanitizedGestureMatchConfigCustomOptions
}

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install" || details.reason === "update") {
    chrome.runtime.openOptionsPage()
  }
})
