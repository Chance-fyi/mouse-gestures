import { Storage } from "@plasmohq/storage"

import { Command } from "~commands/command"
import { LocalConfig } from "~config/config"
import type {
  ConfigGesture,
  GestureMatchConfigCustomOptions,
  LocalConfigInterface
} from "~config/config-interface"
import { Trajectory, type Point } from "~core/trajectory"
import { Group } from "~enum/command"
import type { IframeForwardsTop } from "~enum/message"
import type { ConfirmDialogProps } from "~options/components/confirm"

export const i18n = (key: string = ""): string => {
  return chrome.i18n.getMessage(key)
}

export const matchGesture = (
  trajectory: Point[],
  gestures: ConfigGesture[],
  options: GestureMatchConfigCustomOptions
): string => {
  let similarity = 0
  let uniqueKey = ""

  const defaultOption = {
    angleThreshold: Math.PI / 3, // 60 degree large angle tolerance
    lengthTolerance: 0.5, // 50% length variance allowed
    minSimilarity: 0.7, // Lower similarity threshold
    keyPointOptions: {
      minAngleChange: Math.PI / 6, // 30-degree turn before recording
      minSegmentRatio: 0.2 // Focus on major moving segments
    },
    turnCountPenalty: 0.2
  }
  const angleThreshold = (options.angleThreshold * Math.PI) / 180

  for (const gesture of gestures) {
    const result = Trajectory.matchTrajectories(
      trajectory,
      gesture.trajectory,
      {
        ...defaultOption,
        ...options,
        angleThreshold
      }
    )
    if (result.isMatched && result.similarity > similarity) {
      similarity = result.similarity
      uniqueKey = gesture.uniqueKey
    }
  }
  return uniqueKey
}

export const requestPermissions = (permissions = []): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!permissions || permissions.length === 0) {
      resolve(true)
      return
    }

    chrome.permissions.contains({ permissions }, (has) => {
      if (has) {
        resolve(true)
        return
      }

      chrome.permissions.request({ permissions }, (granted) => {
        resolve(Boolean(granted))
      })
    })
  })
}

export const checkMissingPermissions = async (
  showConfirm: (options: ConfirmDialogProps) => void
) => {
  const config = await new Storage({ area: "local" }).get(LocalConfig.key)
  let parsed: LocalConfigInterface
  if (typeof config === "string") {
    parsed = JSON.parse(config) as LocalConfigInterface
  } else {
    parsed = config ?? LocalConfig.default
  }

  let permissions: string[] = []

  Object.entries(parsed).forEach(([key, gesture]) => {
    for (const g of gesture) {
      const command = new Command(key as Group).getCommands()[
        g.command.uniqueKey
      ]
      if (command.permissions) {
        permissions = permissions.concat(command.permissions)
      }
    }
  })
  permissions = [...new Set(permissions)]

  if (permissions.length > 0) {
    const p = await chrome.permissions.getAll()
    permissions = permissions.filter((v) => !p.permissions.includes(v))
  }

  if (permissions.length > 0) {
    showConfirm({
      title: i18n("request_permissions"),
      content: i18n("request_permissions_desc").replace(
        "{}",
        permissions.map((v) => "• " + v).join("\n")
      ),
      forceConfirm: true,
      onConfirm: () => requestPermissions(permissions)
    })
  }
}

export const notifyIframes = (
  type: IframeForwardsTop,
  e: MouseEvent | DragEvent
) => {
  const iframes = Array.from(document.querySelectorAll("iframe"))
  iframes.forEach((iframe) => {
    iframe.contentWindow.postMessage(
      {
        id: chrome.runtime.id,
        type: type,
        event: {
          type: e.type,
          button: e.button,
          buttons: e.buttons,
          clientX: e.clientX,
          clientY: e.clientY
        } as MouseEvent | DragEvent
      },
      "*"
    )
  })
}

export const getOffsetToTop = (): { x: number; y: number } => {
  let x = 0
  let y = 0

  let win: Window | null = window

  while (win && win !== win.top) {
    const frame = win.frameElement as HTMLElement | null
    if (!frame) break

    const rect = frame.getBoundingClientRect()
    x += rect.left
    y += rect.top

    win = win.parent
  }

  return { x, y }
}
