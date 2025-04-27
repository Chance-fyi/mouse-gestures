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
  private lastX: number
  private lastY: number
  private blockMenu: boolean = false
  private readonly os: string // operating system
  private doubleRightClick: boolean = false // Double right-click to disable gestures and bring up the context menu in a mac or linux environment.

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

    document.addEventListener("contextmenu", this.contextmenu)
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
    this.lastX = e.clientX - this.left
    this.lastY = e.clientY - this.top
    if (e.type === "mousedown") {
      document.addEventListener("mousemove", this.mouseMove)
      document.addEventListener("mouseup", this.mouseUp)
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
      document.addEventListener("drag", this.mouseMove)
      document.addEventListener("dragend", this.mouseUp)
    }
  }

  public mouseMove(e: MouseEvent | DragEvent) {
    if (!this.config) return
    if (this.doubleRightClick) {
      this.doubleRightClick = false
      this.mouseUp(e)
      return
    }

    const currentX: number = e.clientX - this.left
    const currentY: number = e.clientY - this.top

    const distance = Math.sqrt(
      Math.pow(currentX - this.lastX, 2) + Math.pow(currentY - this.lastY, 2)
    )

    this.canvas.beginPath()
    this.canvas.moveTo(this.lastX, this.lastY)

    // Bessel curve
    const smoothness = Math.min(0.5, distance / 100)
    const controlX = this.lastX + (currentX - this.lastX) * smoothness
    const controlY = this.lastY + (currentY - this.lastY) * smoothness

    this.canvas.quadraticCurveTo(controlX, controlY, currentX, currentY)

    this.canvas.strokeStyle = this.config.strokeStyle
    this.canvas.lineWidth = this.config.lineWidth
    this.canvas.lineCap = "round"
    this.canvas.lineJoin = "round"

    this.canvas.stroke()
    this.canvas.closePath()

    this.lastX = currentX
    this.lastY = currentY

    Trajectory.addPoint({ x: e.clientX, y: e.clientY })

    if (!this.setting) {
      const trajectory = Trajectory.simplifyTrajectory(Trajectory.trajectory)
      if (trajectory.length < 2) return
      sendToBackground({
        name: "matching",
        body: {
          trajectory: trajectory,
          group: this.group
        }
      }).then((res) => {
        this.setTooltipVisible(
          this.config.showTooltip && (res.message as boolean)
        )
        this.setTooltipText(res.message)
      })
    }
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
    this.upCallback(this)

    document.removeEventListener("mousemove", this.mouseMove)
    document.removeEventListener("mouseup", this.mouseUp)
    document.removeEventListener("drag", this.mouseMove)
    document.removeEventListener("dragend", this.mouseUp)
    Trajectory.clear()
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
    document.removeEventListener("contextmenu", this.contextmenu)
  }
}
