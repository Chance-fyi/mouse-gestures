import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useRef } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/dist/hook"

import { Command } from "~commands/command"
import { SyncConfig } from "~config/config"
import { Event } from "~core/event"
import { Trajectory } from "~core/trajectory"
import { Group } from "~enum/command"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export default () => {
  const canvasRef = useRef(null)
  const [syncConfig] = useStorage(SyncConfig.key, SyncConfig.default)

  useEffect(() => {
    document.addEventListener("mousedown", startDrawing)
  }, [])

  const startDrawing = (e) => {
    const canvas = canvasRef.current
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    const ctx = canvas.getContext("2d")
    const event = new Event({
      canvas: ctx,
      upCallback: upCallback,
      config: syncConfig,
      setting: false
    })
    event.mouseDown(e)
  }

  const upCallback = (t: Event) => {
    t.canvas.clearRect(0, 0, t.canvas.canvas.width, t.canvas.canvas.height)
    const trajectory = Trajectory.simplifyTrajectory(Trajectory.trajectory, 10)
    if (trajectory.length < 2) return

    sendToBackground({
      name: "execute",
      body: {
        trajectory: trajectory,
        group: Group.Gesture
      }
    }).then((res) => {
      const command = new Command(Group.Gesture).getCommands()[
        res.command.uniqueKey
      ]
      command.config = res.command.config
      command.execute()
    })
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        className="w-screen h-screen fixed top-0 left-0 z-[99999] pointer-events-none"
      />
    </>
  )
}
