import { Storage } from "@plasmohq/storage"

import { LocalConfig } from "~config/config"
import type { LocalConfigInterface } from "~config/config-interface"

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

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install" || details.reason === "update") {
    chrome.runtime.openOptionsPage()
  }
})
