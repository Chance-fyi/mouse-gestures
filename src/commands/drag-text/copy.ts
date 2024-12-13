import type { CommandInterface } from "~commands/command-interface"

export class Copy implements CommandInterface {
  readonly uniqueKey: string = "drag-text-copy"
  readonly title: string = "command_drag_text_copy_title"
  readonly description: string = "command_drag_text_copy_description"
  config: { [key: string]: any } = {}

  execute(): void {
    console.log("copy")
  }
}
