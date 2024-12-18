import type { CommandInterface } from "~commands/command-interface"
import type { DragData } from "~core/event"

export class Copy implements CommandInterface {
  readonly uniqueKey: string = "drag-text-copy"
  readonly title: string = "command_drag_text_copy_title"
  readonly description: string = "command_drag_text_copy_description"
  config: { [key: string]: any } = {}
  data: DragData

  window: boolean = true

  execute(): void {
    navigator.clipboard.writeText(this.data.content).then()
  }
}
