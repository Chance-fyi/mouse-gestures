import type { CommandInterface } from "~commands/command-interface"
import type { DragData } from "~core/event"
import { ConfigType } from "~enum/command"

export class OpenWindow implements CommandInterface {
  readonly uniqueKey: string = "drag-url-open-window"
  readonly title: string = "command_drag_url_open_window_title"
  readonly description: string = "command_drag_url_open_window_description"
  config: { [key: string]: any } = {
    incognito: {
      title: "command_gesture_new_window_config_incognito_title",
      description: "command_gesture_new_window_config_incognito_description",
      type: ConfigType.Toggle,
      default: false
    }
  }
  data: DragData

  execute(): void {
    chrome.windows
      .create({
        url: this.data.content,
        incognito: this.config.incognito.value as boolean,
        state: "maximized"
      })
      .then()
  }
}
