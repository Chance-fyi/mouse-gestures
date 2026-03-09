import { type CommandInterface, type Config } from "~commands/command-interface"
import type { DragData } from "~core/event"
import { ConfigType } from "~enum/command"

export class Copy implements CommandInterface {
  readonly uniqueKey: string = "drag-url-copy"
  readonly title: string = "command_drag_url_copy_title"
  readonly description: string = "command_drag_url_copy_description"
  config: { [key: string]: Config } = {
    copyText: {
      title: "command_drag_url_copy_config_copy_text_title",
      description: "command_drag_url_copy_config_copy_text_description",
      type: ConfigType.Toggle,
      value: false
    }
  }
  data: DragData

  window: boolean = true

  execute(): void {
    const shouldCopyText = this.config.copyText.value as boolean
    const text = shouldCopyText
      ? this.data.title?.trim() || this.data.content
      : this.data.content
    navigator.clipboard.writeText(text).then()
  }
}
