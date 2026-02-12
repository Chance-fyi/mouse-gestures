import cssText from "data-text:~style.css"
import type { PlasmoCSConfig, PlasmoGetOverlayAnchor } from "plasmo"
import { useEffect, useRef, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { useStorage } from "@plasmohq/storage/hook"

import { Command } from "~commands/command"
import { SyncConfig } from "~config/config"
import { Event } from "~core/event"
import { Trajectory } from "~core/trajectory"
import {
  IframeForwardsTop,
  type MouseDownData,
  type MouseMoveData,
  type MouseUpData
} from "~enum/message"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  run_at: "document_start",
  all_frames: true,
  // @ts-ignore
  match_origin_as_fallback: true
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const getOverlayAnchor: PlasmoGetOverlayAnchor = async () =>
  document.querySelector("body")

export default () => {
  const canvasRef = useRef(null)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [tooltipText, setTooltipText] = useState("")
  const [syncConfig] = useStorage(SyncConfig.key, SyncConfig.default)
  const eventRef = useRef<Event>(null)

  let os: string
  const isIframe = window !== window.top
  const listenersRegistered = useRef(false)

  useEffect(() => {
    if (listenersRegistered.current) return
    listenersRegistered.current = true

    document.addEventListener("mousedown", startDrawing, { capture: true })
    document.addEventListener("dragstart", startDrawing, { capture: true })

    sendToBackground({
      name: "os",
      body: {}
    }).then((res) => {
      os = res.os
    })

    if (!isIframe) {
      window.addEventListener("message", iframeMessage)
    }

    return () => {
      document.removeEventListener("mousedown", startDrawing, { capture: true })
      document.removeEventListener("dragstart", startDrawing, { capture: true })
      listenersRegistered.current = false
    }
  }, [])

  const newEvent = (): Event => {
    let ctx = null
    if (!isIframe) {
      const canvas = canvasRef.current
      canvas.width = canvas?.clientWidth || document.documentElement.clientWidth
      canvas.height =
        canvas?.clientHeight || document.documentElement.clientHeight
      ctx = canvas.getContext("2d")
    }
    return new Event({
      canvas: ctx,
      upCallback,
      setting: false,
      os,
      setTooltipVisible,
      setTooltipText,
      isIframe
    })
  }

  const startDrawing = (e) => {
    const event = newEvent()
    event.mouseDown(e)
  }

  const upCallback = (t: Event) => {
    t.canvas.clearRect(0, 0, t.canvas.canvas.width, t.canvas.canvas.height)
    const trajectory = Trajectory.simplifyTrajectory(Trajectory.trajectory)
    if (trajectory.length < 2) return

    sendToBackground({
      name: "execute",
      body: {
        trajectory: trajectory,
        group: t.group,
        dragData: t.dragData
      }
    })
      .then((res) => {
        const command = new Command(t.group).getCommands()[
          res.command.uniqueKey
        ]
        command.config = res.command.config
        command.data = t.dragData
        command.execute()
      })
      .finally(() => {
        setTooltipVisible(false)
        setTooltipText("")
      })
  }

  const iframeMessage: (this: Window, ev: MessageEvent<any>) => any = (e) => {
    if (e.data.id !== chrome.runtime.id) return
    switch (e.data.type) {
      case IframeForwardsTop.MouseDown: {
        const data = e.data as MouseDownData
        const event = newEvent()
        event.mouseDown(data.event)
        event.group = data.group
        event.dragData = data.dragData
        eventRef.current = event
        break
      }
      case IframeForwardsTop.MouseMove: {
        const data = e.data as MouseMoveData
        eventRef.current?.mouseMove(data.event)
        break
      }
      case IframeForwardsTop.MouseUp: {
        const data = e.data as MouseUpData
        eventRef.current?.mouseUp(data.event)
        break
      }
    }
  }

  return (
    !isIframe && (
      <>
        <canvas
          ref={canvasRef}
          className="w-screen h-screen fixed top-0 left-0 z-[888] pointer-events-none"
        />
        {tooltipVisible && (
          <div
            style={syncConfig.tooltipStyle ?? SyncConfig.default.tooltipStyle}>
            {tooltipText}
          </div>
        )}
      </>
    )
  )
}
