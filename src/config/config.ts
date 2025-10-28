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
    showTooltip: true,
    showTrajectory: true,
    tooltipStyle: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      backgroundColor: "#1F2937BF",
      color: "#FFF",
      fontSize: "30px",

      padding: "40px",
      borderRadius: "30px",

      minWidth: "15%",
      minHeight: "15%",
      maxWidth: "50%",
      maxHeight: "50%",

      pointerEvents: "none",
      zIndex: 999
    }
  }
}

export class LocalConfig {
  public static readonly key: string = "local-config"
  public static default: LocalConfigInterface = {
    gesture: [
      {
        uniqueKey: "0a8a848d-5f40-4170-ac97-9b5d6066ca48",
        name: "",
        command: {
          uniqueKey: "gesture-reload",
          name: "command_gesture_reload_title",
          config: {
            hard: false
          }
        },
        trajectory: [
          {
            x: 0,
            y: 0
          },
          {
            x: 1,
            y: 0
          },
          {
            x: 1,
            y: 1
          }
        ]
      },
      {
        uniqueKey: "2e795451-3a91-4274-a587-742137d0db88",
        name: "",
        command: {
          uniqueKey: "gesture-close-tab",
          name: "command_gesture_close_tab_title",
          config: {}
        },
        trajectory: [
          {
            x: 0,
            y: 0
          },
          {
            x: 0,
            y: 1
          },
          {
            x: 1,
            y: 1
          }
        ]
      },
      {
        uniqueKey: "9d8c10f0-15a9-4274-aaaf-b57851537c01",
        name: "",
        command: {
          uniqueKey: "gesture-new-tab",
          name: "command_gesture_new_tab_title",
          config: {
            active: true,
            position: "end"
          }
        },
        trajectory: [
          {
            x: 0,
            y: 0
          },
          {
            x: 1,
            y: 0
          },
          {
            x: 1,
            y: -1
          }
        ]
      },
      {
        uniqueKey: "c4b53d1d-dcce-401d-8f2c-672acf87bde3",
        name: "",
        command: {
          uniqueKey: "gesture-toggle-left-tab",
          name: "command_gesture_toggle_left_tab_title",
          config: {}
        },
        trajectory: [
          {
            x: 0,
            y: 0
          },
          {
            x: 0,
            y: -1
          },
          {
            x: -1,
            y: -1
          }
        ]
      },
      {
        uniqueKey: "19745f24-7214-4a25-83f7-2029325c7f6c",
        name: "",
        command: {
          uniqueKey: "gesture-toggle-right-tab",
          name: "command_gesture_toggle_right_tab_title",
          config: {}
        },
        trajectory: [
          {
            x: 0,
            y: 0
          },
          {
            x: 0,
            y: -1
          },
          {
            x: 1,
            y: -1
          }
        ]
      },
      {
        uniqueKey: "f0219044-f136-424b-9f4e-c5c671b39de1",
        name: "",
        command: {
          uniqueKey: "gesture-restore-tab",
          name: "command_gesture_restore_tab_title",
          config: {}
        },
        trajectory: [
          {
            x: 0,
            y: 1
          },
          {
            x: 8,
            y: 2
          },
          {
            x: 0,
            y: 3
          }
        ]
      },
      {
        uniqueKey: "62031594-bab4-4f0c-9e72-d0e5836bc404",
        name: "",
        command: {
          uniqueKey: "gesture-scroll-to-bottom",
          name: "command_gesture_scroll_to_bottom_title",
          config: {
            behavior: "smooth"
          }
        },
        trajectory: [
          {
            x: 1,
            y: 0
          },
          {
            x: 2,
            y: -8
          },
          {
            x: 3,
            y: 0
          }
        ]
      },
      {
        uniqueKey: "49322c45-309a-45a7-9a72-e2ed5c9647c0",
        name: "",
        command: {
          uniqueKey: "gesture-scroll-to-top",
          name: "command_gesture_scroll_to_top_title",
          config: {
            behavior: "smooth"
          }
        },
        trajectory: [
          {
            x: 1,
            y: 0
          },
          {
            x: 2,
            y: 8
          },
          {
            x: 3,
            y: 0
          }
        ]
      },
      {
        uniqueKey: "8148d6b3-6ad8-4225-aa18-919656f2184e",
        name: "",
        command: {
          uniqueKey: "gesture-scroll",
          name: "command_gesture_scroll_title",
          config: {
            direction: "down",
            proportions: "95",
            behavior: "smooth"
          }
        },
        trajectory: [
          {
            x: 0,
            y: 0
          },
          {
            x: 0,
            y: 1
          }
        ]
      },
      {
        uniqueKey: "cf7d5914-ae55-430c-8a29-c327f31fc666",
        name: "",
        command: {
          uniqueKey: "gesture-scroll",
          name: "command_gesture_scroll_title",
          config: {
            direction: "up",
            proportions: "95",
            behavior: "smooth"
          }
        },
        trajectory: [
          {
            x: 0,
            y: 0
          },
          {
            x: 0,
            y: -1
          }
        ]
      },
      {
        uniqueKey: "e97e60d2-1606-4995-83f4-5c5a7dfd1754",
        name: "",
        command: {
          uniqueKey: "gesture-forward",
          name: "command_gesture_forward_title",
          config: {}
        },
        trajectory: [
          {
            x: 0,
            y: 0
          },
          {
            x: 1,
            y: 0
          }
        ]
      },
      {
        uniqueKey: "e0ea77f0-019b-442b-8b75-0237dd43a7ac",
        name: "",
        command: {
          uniqueKey: "gesture-backward",
          name: "command_gesture_backward_title",
          config: {}
        },
        trajectory: [
          {
            x: 0,
            y: 0
          },
          {
            x: -1,
            y: 0
          }
        ]
      }
    ],
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
