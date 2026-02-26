import React from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { SyncConfig } from "~config/config"
import type { SyncConfigInterface } from "~config/config-interface"
import { Trajectory } from "~core/trajectory"
import { Group } from "~enum/command"
import {
  IframeForwardsTop,
  type MouseDownData,
  type MouseMoveData,
  type MouseUpData
} from "~enum/message"
import { getOffsetToTop, notifyIframes } from "~utils/common"

interface Params {
  canvas: CanvasRenderingContext2D
  upCallback: (t: Event) => void
  setting: boolean
  os: string
  setTooltipVisible?: React.Dispatch<React.SetStateAction<boolean>>
  setTooltipText?: React.Dispatch<React.SetStateAction<string>>
  isIframe?: boolean
  config: SyncConfigInterface
  eventRefReset?: () => void
}

export type DragData = {
  content: string
  file?: File
}

let lastRightClickTime: number = 0
let lastGestureEndTime: number = 0
let allowNextContextMenu: boolean = false
const RIGHT_CLICK_DOUBLE_MS = 600

export class Event {
  public canvas: CanvasRenderingContext2D
  public readonly upCallback: (t: Event) => void
  public config: SyncConfigInterface
  public setting: boolean
  public left: number
  public top: number
  private blockMenu: boolean = false
  private readonly os: string // operating system

  private dpr: number = window.devicePixelRatio || 1
  private offscreenCanvas: OffscreenCanvas
  private offscreenCtx: OffscreenCanvasRenderingContext2D
  private isDrawing: boolean = false
  private rafId: number | null = null
  private lastMatchTime: number = 0

  public setTooltipVisible?: React.Dispatch<React.SetStateAction<boolean>>
  public setTooltipText?: React.Dispatch<React.SetStateAction<string>>
  public readonly isIframe: boolean = false
  public eventRefReset?: () => void

  public group: Group = Group.Gesture
  public dragData: DragData

  private readonly offsetToTop: { x: number; y: number } = { x: 0, y: 0 }
  public isMouseDownInCurrentIframe: boolean = false

  constructor({
    canvas,
    upCallback,
    setting,
    os,
    setTooltipVisible,
    setTooltipText,
    isIframe = false,
    config,
    eventRefReset = () => {}
  }: Params) {
    this.config = { ...SyncConfig.default, ...config }
    this.canvas = canvas
    this.upCallback = upCallback
    this.setting = setting
    this.os = os

    this.setTooltipVisible = setTooltipVisible
    this.setTooltipText = setTooltipText

    this.isIframe = isIframe
    this.isMouseDownInCurrentIframe = isIframe
    this.eventRefReset = eventRefReset

    this.offsetToTop = getOffsetToTop()

    this.mouseMove = this.mouseMove.bind(this)
    this.mouseUp = this.mouseUp.bind(this)
    this.contextmenu = this.contextmenu.bind(this)
    this.renderLoop = this.renderLoop.bind(this)

    document.addEventListener("contextmenu", this.contextmenu, {
      capture: true
    })
  }

  public mouseDown(e: MouseEvent | DragEvent, forwards: boolean = true) {
    if (
      (e.type === "mousedown" || e.type === "pointerdown") &&
      !this.isSecondaryButtonEvent(e)
    ) {
      return
    }
    if (this.shouldBypassGestureForContextMenu(e)) {
      this.removeTrackingListeners()
      this.eventRefReset?.()
      Trajectory.clear()
      return
    }
    if (this.setting) {
      const rect = (e.target as HTMLElement).getBoundingClientRect()
      this.left = rect.left
      this.top = rect.top
    } else {
      this.left = 0
      this.top = 0
    }
    if (e.type === "mousedown" || e.type === "pointerdown") {
      this.capturePointerIfPossible(e)

      window.addEventListener("mousemove", this.mouseMove, { capture: true })
      window.addEventListener("mouseup", this.mouseUp, { capture: true })
    }

    if (e.type === "dragstart") {
      const types = (e as DragEvent).dataTransfer?.types ?? []
      if (types.includes("Files")) {
        this.group = Group.DragImage
        this.dragData = {
          content: ((e as DragEvent).target as HTMLImageElement).currentSrc,
          file: (e as DragEvent).dataTransfer.files[0]
        }
      } else if (types.includes("text/uri-list")) {
        this.group = Group.DragUrl
        this.dragData = {
          content: (e as DragEvent).dataTransfer.getData("text/uri-list")
        }
      } else {
        this.group = Group.DragText
        this.dragData = {
          content: (e as DragEvent).dataTransfer?.getData("text/plain")
        }
      }
      window.addEventListener("dragover", this.mouseMove, { capture: true })
      window.addEventListener("dragend", this.mouseUp, { capture: true })
    }

    notifyIframes(IframeForwardsTop.MouseDown, e)
    if (this.isIframe) {
      if (forwards) {
        this.forwardsTop(IframeForwardsTop.MouseDown, e)
      }
      return
    }

    this.initCanvasDPI()
    this.isDrawing = true
    this.startAnimation()
  }

  public mouseMove(e: MouseEvent | DragEvent, forwards: boolean = true) {
    if (!this.config) return
    if (e.clientX === 0 && e.clientY === 0) return
    if (this.group === Group.Gesture && !this.isSecondaryButtonPressed(e)) {
      return
    }

    Trajectory.addPoint({ x: e.clientX, y: e.clientY })

    if (this.isIframe) {
      if (forwards) {
        this.forwardsTop(IframeForwardsTop.MouseMove, e)
      }
      return
    }

    if (Trajectory.trajectory.length <= 10) {
      notifyIframes(IframeForwardsTop.MouseMove, e)
    }

    this.matchRealtime()
  }

  public mouseUp(e: MouseEvent | DragEvent, forwards: boolean = true) {
    if (!this.setting) {
      setTimeout(() => {
        this.setTooltipVisible(false)
        this.setTooltipText("")
      }, 500)
    }

    if (this.group !== Group.Gesture) {
      Trajectory.delPoint()
    }
    const blockMenu = Trajectory.trajectory.length > 5
    if (blockMenu) {
      lastGestureEndTime = Date.now()
    }
    this.blockRightClickMenu(e, blockMenu)
    this.blockMenu = blockMenu
    // Cancel the gesture by left-clicking
    if (e.type === "mouseup" && !this.isSecondaryButtonEvent(e)) {
      this.setTooltipVisible(false)
      Trajectory.clear()
    }

    this.removeTrackingListeners()

    if (!this.isIframe) {
      this.upCallback(this)
    }
    Trajectory.clear()

    // When the right mouse button is released outside the iframe, the `contextmenu` event inside the iframe is not triggered, so event cleanup must be delayed.
    setTimeout(() => {
      this.contextmenu(e)
    }, 10)

    this.eventRefReset()
    if (this.isIframe) {
      if (forwards) {
        this.forwardsTop(IframeForwardsTop.MouseUp, e)
      }
      return
    }

    this.isDrawing = false
    this.stopAnimation()
    this.offscreenCtx = null
    this.offscreenCanvas = null
    notifyIframes(IframeForwardsTop.MouseUp, e)
  }

  private blockRightClickMenu(e: MouseEvent | DragEvent, blockMenu: boolean) {
    if (this.os == "mac" || this.os == "linux") {
      if (blockMenu) {
        // Gesture just completed: always suppress native menu.
        e.preventDefault()
        e.stopPropagation()
        allowNextContextMenu = false
        lastRightClickTime = 0
        return
      }
      if (allowNextContextMenu) {
        allowNextContextMenu = false
        return
      }
      // Default behavior on macOS/Linux: block context menu unless explicitly allowed.
      e.preventDefault()
      e.stopPropagation()
    } else {
      if (blockMenu) {
        // Block right-click menu
        e.preventDefault()
        e.stopPropagation()
      }
    }
  }

  private isSecondaryButtonEvent(e: MouseEvent | DragEvent): boolean {
    return e.button === 2
  }

  private isSecondaryButtonPressed(e: MouseEvent | DragEvent): boolean {
    if (typeof e.buttons === "number") {
      return (e.buttons & 2) === 2
    }
    return this.isSecondaryButtonEvent(e)
  }

  private shouldBypassGestureForContextMenu(e: MouseEvent | DragEvent): boolean {
    if (this.os !== "mac" && this.os !== "linux") return false
    if (e.type !== "mousedown" && e.type !== "pointerdown") return false
    if (!this.isSecondaryButtonEvent(e)) return false

    const now = Date.now()
    // Right after a completed gesture, this click must not open menu directly.
    if (now - lastGestureEndTime < RIGHT_CLICK_DOUBLE_MS) {
      allowNextContextMenu = false
      lastRightClickTime = now
      return false
    }

    // Double right-click opens one context menu.
    if (now - lastRightClickTime < RIGHT_CLICK_DOUBLE_MS) {
      allowNextContextMenu = true
      lastRightClickTime = 0
      return true
    }

    allowNextContextMenu = false
    lastRightClickTime = now
    return false
  }

  private removeTrackingListeners() {
    window.removeEventListener("mousemove", this.mouseMove, { capture: true })
    window.removeEventListener("mouseup", this.mouseUp, { capture: true })
    window.removeEventListener("dragover", this.mouseMove, { capture: true })
    window.removeEventListener("dragend", this.mouseUp, { capture: true })
  }

  private capturePointerIfPossible(e: MouseEvent | DragEvent) {
    if (e.type !== "pointerdown") return
    const pointerEvent = e as unknown as PointerEvent
    if (typeof pointerEvent.pointerId !== "number") return

    const target = e.target as Element | null
    if (!target || !("setPointerCapture" in target)) return

    try {
      ;(target as Element).setPointerCapture(pointerEvent.pointerId)
    } catch {
      // Ignore failures from detached/non-capturable targets.
    }
  }

  public contextmenu(e: MouseEvent) {
    this.blockRightClickMenu(
      e,
      this.blockMenu || Trajectory.trajectory.length > 5
    )
    if (!e.defaultPrevented) {
      this.removeTrackingListeners()
      this.eventRefReset?.()
      this.isDrawing = false
      this.stopAnimation()
      Trajectory.clear()
    }
    this.blockMenu = false
    document.removeEventListener("contextmenu", this.contextmenu, {
      capture: true
    })
  }

  private initCanvasDPI() {
    const { width, height } = this.canvas.canvas
    this.canvas.canvas.style.width = `${width}px`
    this.canvas.canvas.style.height = `${height}px`
    this.canvas.canvas.width = width * this.dpr
    this.canvas.canvas.height = height * this.dpr

    this.offscreenCanvas = new OffscreenCanvas(width, height)
    this.offscreenCtx = this.offscreenCanvas.getContext("2d")

    this.offscreenCanvas.width = width * this.dpr
    this.offscreenCanvas.height = height * this.dpr

    this.canvas.scale(this.dpr, this.dpr)
    this.offscreenCtx.scale(this.dpr, this.dpr)
  }

  private startAnimation() {
    if (!this.rafId) {
      this.rafId = requestAnimationFrame(this.renderLoop)
    }
  }

  private renderLoop() {
    if (!this.isDrawing) {
      this.stopAnimation()
      return
    }
    this.draw()
    this.rafId = requestAnimationFrame(this.renderLoop)
  }

  private draw() {
    if (!this.config) return
    if (!this.setting && !this.config.showTrajectory) return
    const points = Trajectory.trajectory
    if (points.length < 3) return
    const ctx = this.offscreenCtx
    const mainCtx = this.canvas
    const { width, height } = ctx.canvas

    ctx.clearRect(0, 0, width / this.dpr, height / this.dpr)

    ctx.beginPath()
    ctx.moveTo(points[0].x - this.left, points[0].y - this.top)

    for (let i = 1; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2 - this.left
      const yc = (points[i].y + points[i + 1].y) / 2 - this.top
      ctx.quadraticCurveTo(
        points[i].x - this.left,
        points[i].y - this.top,
        xc,
        yc
      )
    }

    ctx.strokeStyle = this.config.strokeStyle
    ctx.lineWidth = this.config.lineWidth
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.stroke()

    mainCtx.clearRect(0, 0, width / this.dpr, height / this.dpr)
    mainCtx.drawImage(
      this.offscreenCanvas,
      0,
      0,
      width / this.dpr,
      height / this.dpr
    )
  }

  private stopAnimation() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  private matchRealtime() {
    if (this.setting) return
    const now = performance.now()
    if (now - this.lastMatchTime < 50) return
    this.lastMatchTime = now

    const trajectory = Trajectory.simplifyTrajectory(Trajectory.trajectory)

    if (trajectory.length < 2) return

    sendToBackground({
      name: "matching",
      body: {
        trajectory,
        group: this.group
      }
    }).then((res) => {
      this.setTooltipVisible(
        this.config!.showTooltip && (res.message as boolean)
      )
      this.setTooltipText(res.message)
    })
  }

  private forwardsTop(type: IframeForwardsTop, e: MouseEvent | DragEvent) {
    if (!this.isIframe) return

    const offset = this.offsetToTop
    const event = {
      type: e.type,
      button: e.button,
      buttons: e.buttons,
      clientX: e.clientX + offset.x,
      clientY: e.clientY + offset.y
    } as MouseEvent | DragEvent

    switch (type) {
      case IframeForwardsTop.MouseDown:
        window.top.postMessage({
          id: chrome.runtime.id,
          type,
          event,
          group: this.group,
          dragData: this.dragData
        } as MouseDownData, "*")
        break
      case IframeForwardsTop.MouseMove:
        window.top.postMessage({
          id: chrome.runtime.id,
          type,
          event
        } as MouseMoveData, "*")
        break
      case IframeForwardsTop.MouseUp:
        window.top.postMessage({
          id: chrome.runtime.id,
          type,
          event
        } as MouseUpData, "*")
        break
    }
  }
}
