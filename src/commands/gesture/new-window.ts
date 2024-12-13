import type { CommandInterface } from "~commands/command-interface"
import { ConfigType } from "~enum/command"

export class NewWindow implements CommandInterface {
  readonly uniqueKey: string = "gesture-new-window"
  readonly title: string = "command_gesture_new_window_title"
  readonly description: string = "command_gesture_new_window_description"
  config: { [key: string]: any } = {
    incognito: {
      title: "command_gesture_new_window_config_incognito_title",
      description: "command_gesture_new_window_config_incognito_description",
      type: ConfigType.Toggle,
      default: false
    }
  }

  execute(): void {
    chrome.windows
      .create({
        incognito: this.config.incognito.value as boolean,
        state: "maximized"
      })
      .then()
  }
}
