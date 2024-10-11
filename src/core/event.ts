import { Config } from "~config/config"
import { Trajectory } from "~core/trajectory"

interface Params {
  canvas: CanvasRenderingContext2D
  upCallback: (t: Event) => void
}

export class Event {
  public canvas: CanvasRenderingContext2D
  public readonly upCallback: (t: Event) => void
  public left: number
  public top: number
  private lastX: number
  private lastY: number

  constructor({ canvas, upCallback }: Params) {
    this.canvas = canvas
    this.upCallback = upCallback

    this.mouseMove = this.mouseMove.bind(this)
    this.mouseUp = this.mouseUp.bind(this)
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
    this.canvas.strokeStyle = Config.get().strokeStyle
    this.canvas.lineWidth = Config.get().lineWidth
    this.canvas.stroke()
    this.canvas.closePath()
    this.lastX = currentX
    this.lastY = currentY

    Trajectory.addPoint({ x: e.clientX, y: e.clientY })
  }

  public mouseUp(e: MouseEvent) {
    this.upCallback(this)

    document.removeEventListener("mousemove", this.mouseMove)
    document.removeEventListener("mouseup", this.mouseUp)
    Trajectory.clear()
  }
}
