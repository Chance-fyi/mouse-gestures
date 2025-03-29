import type { CommandInterface } from "~commands/command-interface"
import { ConfigType } from "~enum/command"

export class Reload implements CommandInterface {
  readonly uniqueKey: string = "gesture-reload"
  readonly title: string = "command_gesture_reload_title"
  readonly description: string = "command_gesture_reload_description"
  config: { [key: string]: any } = {
    hard: {
      title: "command_gesture_reload_hard_title",
      description: "command_gesture_reload_hard_description",
      type: ConfigType.Toggle,
      value: false
    }
  }

  execute(): void {
    chrome.tabs
      .reload(null, { bypassCache: this.config.hard.value as boolean })
      .then()
  }
}
