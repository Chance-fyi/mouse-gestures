import type { CommandInterface } from "~commands/command-interface"
import type { DragData } from "~core/event"

export class Download implements CommandInterface {
  readonly uniqueKey: string = "drag-image-download"
  readonly title: string = "command_drag_image_download_title"
  readonly description: string = "command_drag_image_download_description"
  config: { [key: string]: any } = {}
  data: DragData
  permissions: string[] = ["downloads"]

  execute(): void {
    chrome.downloads
      .download({
        url: this.data.content
      })
      .then()
  }
}
