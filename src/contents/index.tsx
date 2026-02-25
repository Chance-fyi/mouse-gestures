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
  type MouseUpData,
  type TopData
} from "~enum/message"
import { notifyIframes } from "~utils/common"

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
  const syncConfigRef = useRef(syncConfig)
  const eventRef = useRef<Event>(null)

  useEffect(() => {
    syncConfigRef.current = syncConfig
  }, [syncConfig])

  let os: string
  const isIframe = window !== window.top
  const listenersRegistered = useRef(false)

  useEffect(() => {
    if (listenersRegistered.current) return
    listenersRegistered.current = true
    const supportsPointerEvents =
      typeof (globalThis as { PointerEvent?: unknown }).PointerEvent ===
      "function"

    if (supportsPointerEvents) {
      window.addEventListener("pointerdown", startDrawing, { capture: true })
    } else {
      window.addEventListener("mousedown", startDrawing, { capture: true })
    }
    window.addEventListener("dragstart", startDrawing, { capture: true })

    sendToBackground({
      name: "os",
      body: {}
    }).then((res) => {
      os = res.os
    })

    if (!isIframe) {
      window.addEventListener("message", iframeMessage)
    } else {
      window.addEventListener("message", topMessage)
    }

    return () => {
      if (supportsPointerEvents) {
        window.removeEventListener("pointerdown", startDrawing, {
          capture: true
        })
      } else {
        window.removeEventListener("mousedown", startDrawing, { capture: true })
      }
      window.removeEventListener("dragstart", startDrawing, { capture: true })
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
      isIframe,
      config: syncConfigRef.current,
      eventRefReset: () => {
        eventRef.current = null
      }
    })
  }

  const startDrawing = (e) => {
    const event = newEvent()
    event.mouseDown(e)
    eventRef.current = event
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
        const ev = new MouseEvent(data.event.type, data.event)
        event.mouseDown(ev)
        event.group = data.group
        event.dragData = data.dragData
        eventRef.current = event
        break
      }
      case IframeForwardsTop.MouseMove: {
        const data = e.data as MouseMoveData
        eventRef.current?.mouseMove(new MouseEvent(data.event.type, data.event))
        break
      }
      case IframeForwardsTop.MouseUp: {
        const data = e.data as MouseUpData
        const ev = new MouseEvent(data.event.type, data.event)
        eventRef.current?.mouseUp(ev)
        notifyIframes(IframeForwardsTop.MouseUp, ev)
        break
      }
    }
  }

  const topMessage: (this: Window, ev: MessageEvent<any>) => any = (e) => {
    if (e.data.id !== chrome.runtime.id) return
    const data = e.data as TopData
    switch (data.type) {
      case IframeForwardsTop.MouseDown: {
        const ev = new MouseEvent(data.event.type, data.event)
        notifyIframes(IframeForwardsTop.MouseDown, ev)
        if (eventRef.current) break
        const event = newEvent()
        event.mouseDown(ev, false)
        event.isMouseDownInCurrentIframe = false
        eventRef.current = event
        break
      }
      case IframeForwardsTop.MouseMove: {
        const ev = new MouseEvent(data.event.type, data.event)
        notifyIframes(IframeForwardsTop.MouseMove, ev)
        if (eventRef.current?.isMouseDownInCurrentIframe) break
        eventRef.current?.mouseMove(ev, false)
        break
      }
      case IframeForwardsTop.MouseUp: {
        const ev = new MouseEvent(data.event.type, data.event)
        notifyIframes(IframeForwardsTop.MouseUp, ev)
        eventRef.current?.mouseUp(ev, false)
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
