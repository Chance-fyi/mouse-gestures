import type { CommandInterface } from "~commands/command-interface"
import type { DragData } from "~core/event"

export class CopyImage implements CommandInterface {
  readonly uniqueKey: string = "drag-image-copy-image"
  readonly title: string = "command_drag_image_copy_image_title"
  readonly description: string = "command_drag_image_copy_image_description"
  config: { [key: string]: any } = {}
  data: DragData

  window: boolean = true

  execute(): void {
    const clipboardItem = new ClipboardItem({
      [this.data.file.type]: this.data.file
    })
    navigator.clipboard.write([clipboardItem]).then()
  }
}
