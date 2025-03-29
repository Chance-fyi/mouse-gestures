import type { CommandInterface } from "~commands/command-interface"
import { ConfigType } from "~enum/command"

export class OpenUrlWindow implements CommandInterface {
  readonly uniqueKey: string = "gesture-open-url-window"
  readonly title: string = "command_gesture_open_url_window_title"
  readonly description: string = "command_gesture_open_url_window_description"
  config: { [key: string]: any } = {
    url: {
      title: "command_gesture_open_url_config_url_title",
      description: "command_gesture_open_url_config_url_description",
      type: ConfigType.Input,
      value: ""
    },
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
        url: this.config.url.value,
        incognito: this.config.incognito.value as boolean,
        state: "maximized"
      })
      .then()
  }
}
