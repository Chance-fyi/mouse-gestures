import type { SyncConfigInterface } from "~config/config-interface"
import { Trajectory } from "~core/trajectory"

interface Params {
  canvas: CanvasRenderingContext2D
  upCallback: (t: Event) => void
  config: SyncConfigInterface
  setting: boolean
}

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

  constructor({ canvas, upCallback, config, setting }: Params) {
    this.canvas = canvas
    this.upCallback = upCallback
    this.config = config
    this.setting = setting

    this.mouseMove = this.mouseMove.bind(this)
    this.mouseUp = this.mouseUp.bind(this)

    document.addEventListener("contextmenu", (e: MouseEvent) => {
      if (this.blockMenu) {
        // Block right-click menu
        e.preventDefault()
        this.blockMenu = false
      }
    })
  }

  public mouseDown(e: MouseEvent) {
    if (e.button !== 2) {
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
    document.addEventListener("mousemove", this.mouseMove)
    document.addEventListener("mouseup", this.mouseUp)
  }

  public mouseMove(e: MouseEvent) {
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
  }

  public mouseUp(e: MouseEvent) {
    this.blockMenu = Trajectory.trajectory.length > 5
    this.upCallback(this)

    document.removeEventListener("mousemove", this.mouseMove)
    document.removeEventListener("mouseup", this.mouseUp)
    Trajectory.clear()
  }
}
