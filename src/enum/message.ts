import type { DragData } from "~core/event"
import { Group } from "~enum/command"

export enum IframeForwardsTop {
  MouseDown = "mouseDown",
  MouseMove = "mouseMove",
  MouseUp = "mouseUp"
}

export type MouseDownData = {
  id: string
  type: string
  event: MouseEvent | DragEvent
  group: Group
  dragData: DragData
  relayUp?: boolean
}

export type MouseMoveData = {
  id: string
  type: string
  event: MouseEvent | DragEvent
  relayUp?: boolean
}

export type MouseUpData = {
  id: string
  type: string
  event: MouseEvent | DragEvent
  relayUp?: boolean
}

export type TopData = {
  id: string
  type: string
  event: MouseEvent | DragEvent
  relayUp?: boolean
}
