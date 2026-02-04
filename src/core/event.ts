import React from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import { SyncConfig } from "~config/config"
import type { SyncConfigInterface } from "~config/config-interface"
import { Trajectory } from "~core/trajectory"
import { Group } from "~enum/command"

interface Params {
  canvas: CanvasRenderingContext2D
  upCallback: (t: Event) => void
  setting: boolean
  os: string
  setTooltipVisible?: React.Dispatch<React.SetStateAction<boolean>>
  setTooltipText?: React.Dispatch<React.SetStateAction<string>>
}

export type DragData = {
  content: string
  file?: File
}

let lastRightClickTime: number = 0

export class Event {
  public canvas: CanvasRenderingContext2D
  public readonly upCallback: (t: Event) => void
  public config: SyncConfigInterface
  public setting: boolean
  public left: number
  public top: number
  private blockMenu: boolean = false
  private readonly os: string // operating system
  private doubleRightClick: boolean = false // Double right-click to disable gestures and bring up the context menu in a mac or linux environment.

  private dpr: number = window.devicePixelRatio || 1
  private offscreenCanvas: OffscreenCanvas
  private offscreenCtx: OffscreenCanvasRenderingContext2D
  private isDrawing: boolean = false
  private rafId: number | null = null
  private lastMatchTime: number = 0

  public setTooltipVisible?: React.Dispatch<React.SetStateAction<boolean>>
  public setTooltipText?: React.Dispatch<React.SetStateAction<string>>
  public group: Group = Group.Gesture
  public dragData: DragData

  constructor({
    canvas,
    upCallback,
    setting,
    os,
    setTooltipVisible,
    setTooltipText
  }: Params) {
    const storage = new Storage()
    storage.get(SyncConfig.key).then((c) => {
      this.config = (c as unknown as SyncConfigInterface) || SyncConfig.default
      this.config = { ...SyncConfig.default, ...this.config }
    })
    this.canvas = canvas
    this.upCallback = upCallback
    this.setting = setting
    this.os = os

    this.setTooltipVisible = setTooltipVisible
    this.setTooltipText = setTooltipText

    this.mouseMove = this.mouseMove.bind(this)
    this.mouseUp = this.mouseUp.bind(this)
    this.contextmenu = this.contextmenu.bind(this)
    this.renderLoop = this.renderLoop.bind(this)

    document.addEventListener("contextmenu", this.contextmenu, {
      capture: true
    })
  }

  public mouseDown(e: MouseEvent | DragEvent) {
    if (e.type === "mousedown" && e.button !== 2) {
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
    if (e.type === "mousedown") {
      document.addEventListener("mousemove", this.mouseMove, { capture: true })
      document.addEventListener("mouseup", this.mouseUp, { capture: true })
    }

    if (e.type === "dragstart") {
      const types = (e as DragEvent).dataTransfer.types
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
      } else if (types.includes("text/plain")) {
        this.group = Group.DragText
        this.dragData = {
          content: (e as DragEvent).dataTransfer.getData("text/plain")
        }
      } else {
        return
      }
      document.addEventListener("drag", this.mouseMove, { capture: true })
      document.addEventListener("dragend", this.mouseUp, { capture: true })
    }

    this.initCanvasDPI()
    this.isDrawing = true
    this.startAnimation()
  }

  public mouseMove(e: MouseEvent | DragEvent) {
    if (!this.config) return
    if (this.doubleRightClick) {
      this.doubleRightClick = false
      this.mouseUp(e)
      return
    }
    if (e.clientX === 0 && e.clientY === 0) return

    Trajectory.addPoint({ x: e.clientX, y: e.clientY })

    this.matchRealtime()
  }

  public mouseUp(e: MouseEvent | DragEvent) {
    if (!this.setting) {
      setTimeout(() => {
        this.setTooltipVisible(false)
        this.setTooltipText("")
      }, 500)
    }

    if (this.group !== Group.Gesture) {
      Trajectory.delPoint()
    }
    this.blockMenu = Trajectory.trajectory.length > 5
    // Cancel the gesture by left-clicking
    if (e.type === "mouseup" && e.button === 0) {
      this.setTooltipVisible(false)
      Trajectory.clear()
    }
    this.upCallback(this)

    document.removeEventListener("mousemove", this.mouseMove, { capture: true })
    document.removeEventListener("mouseup", this.mouseUp, { capture: true })
    document.removeEventListener("drag", this.mouseMove, { capture: true })
    document.removeEventListener("dragend", this.mouseUp, { capture: true })
    Trajectory.clear()

    this.isDrawing = false
    this.stopAnimation()
    this.offscreenCtx = null
    this.offscreenCanvas = null
  }

  public contextmenu(e: MouseEvent) {
    if (this.os == "mac" || this.os == "linux") {
      const time = Date.now()
      // Two right clicks with a time interval of less than 600ms are considered to be a double right-click
      if (time - lastRightClickTime < 600) {
        this.doubleRightClick = true
      } else {
        // Block right-click menu
        e.preventDefault()
      }
      lastRightClickTime = time
    } else {
      if (this.blockMenu) {
        // Block right-click menu
        e.preventDefault()
        this.blockMenu = false
      }
    }
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
}
