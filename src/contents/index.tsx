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
import { findFrameElementByWindow, notifyIframes } from "~utils/common"

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

  // Re-attach plasmo-csui shadow host if page DOM updates remove it
  useEffect(() => {
    if (window !== window.top) return
    const root = canvasRef.current?.getRootNode() as ShadowRoot
    const shadowHost = root?.host as HTMLElement
    if (!shadowHost) return

    const observer = new MutationObserver(() => {
      if (!shadowHost.isConnected && document.body) {
        document.body.appendChild(shadowHost)
      }
    })
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    })
    return () => observer.disconnect()
  }, [])

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
    const data = normalizeUpMessage(e, e.data as TopData)
    switch (data.type) {
      case IframeForwardsTop.MouseDown: {
        const downData = data as MouseDownData
        const event = newEvent()
        const ev = new MouseEvent(downData.event.type, downData.event)
        event.mouseDown(ev)
        event.group = downData.group
        event.dragData = downData.dragData
        eventRef.current = event
        break
      }
      case IframeForwardsTop.MouseMove: {
        const moveData = data as MouseMoveData
        eventRef.current?.mouseMove(
          new MouseEvent(moveData.event.type, moveData.event)
        )
        break
      }
      case IframeForwardsTop.MouseUp: {
        const upData = data as MouseUpData
        const ev = new MouseEvent(upData.event.type, upData.event)
        eventRef.current?.mouseUp(ev)
        notifyIframes(IframeForwardsTop.MouseUp, ev)
        break
      }
    }
  }

  const topMessage: (this: Window, ev: MessageEvent<any>) => any = (e) => {
    if (e.data.id !== chrome.runtime.id) return
    const data = normalizeUpMessage(e, e.data as TopData)
    if (data.relayUp) {
      window.parent.postMessage(data, "*")
      return
    }
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

  const normalizeUpMessage = (e: MessageEvent<any>, data: TopData): TopData => {
    if (!data.relayUp) return data

    const sourceWindow = e.source as Window | null
    if (!sourceWindow) return data

    const frame = findFrameElementByWindow(document, sourceWindow)
    if (!frame) return data

    const rect = frame.getBoundingClientRect()
    return {
      ...data,
      event: {
        ...data.event,
        clientX: data.event.clientX + rect.left,
        clientY: data.event.clientY + rect.top
      } as MouseEvent | DragEvent
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
