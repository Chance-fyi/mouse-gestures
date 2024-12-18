import type { CommandInterface } from "~commands/command-interface"
import type { DragData } from "~core/event"

export class CopyUrl implements CommandInterface {
  readonly uniqueKey: string = "drag-image-copy-url"
  readonly title: string = "command_drag_image_copy_url_title"
  readonly description: string = "command_drag_image_copy_url_description"
  config: { [key: string]: any } = {}
  data: DragData

  window: boolean = true

  execute(): void {
    navigator.clipboard.writeText(this.data.content).then()
  }
}
