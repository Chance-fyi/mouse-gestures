import type { CommandInterface } from "~commands/command-interface"

export class Reload implements CommandInterface {
  readonly uniqueKey: string = "gesture-reload"
  readonly title: string = "command_gesture_reload_title"
  readonly description: string = "command_gesture_reload_description"
  config: { [key: string]: any } = {}

  window: boolean = true

  execute(): void {
    location.reload()
  }
}
