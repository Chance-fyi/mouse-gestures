import type { SyncConfigInterface } from "~config/config-interface"
import { Trajectory } from "~core/trajectory"

interface Params {
  canvas: CanvasRenderingContext2D
  upCallback: (t: Event) => void
  config: SyncConfigInterface
}

export class Event {
  public canvas: CanvasRenderingContext2D
  public readonly upCallback: (t: Event) => void
  public config: SyncConfigInterface
  public left: number
  public top: number
  private lastX: number
  private lastY: number
  private blockMenu: boolean = false

  constructor({ canvas, upCallback, config }: Params) {
    this.canvas = canvas
    this.upCallback = upCallback
    this.config = config

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
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect()
    this.left = rect.left
    this.top = rect.top
    this.lastX = e.clientX - rect.left
    this.lastY = e.clientY - rect.top
    document.addEventListener("mousemove", this.mouseMove)
    document.addEventListener("mouseup", this.mouseUp)
  }

  public mouseMove(e: MouseEvent) {
    const currentX: number = e.clientX - this.left
    const currentY: number = e.clientY - this.top
    this.canvas.beginPath()
    this.canvas.moveTo(this.lastX, this.lastY)
    // Using Bessel curves to smooth trajectories
    this.canvas.quadraticCurveTo(
      (this.lastX + currentX) / 2,
      (this.lastY + currentY) / 2,
      currentX,
      currentY
    )
    this.canvas.strokeStyle = this.config.strokeStyle
    this.canvas.lineWidth = this.config.lineWidth
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
