import type { CommandInterface } from "~commands/command-interface"
import { ConfigType } from "~enum/command"

export class ReloadAll implements CommandInterface {
  readonly uniqueKey: string = "gesture-reload-all"
  readonly title: string = "command_gesture_reload_all_title"
  readonly description: string = "command_gesture_reload_all_description"
  config: { [key: string]: any } = {
    currentWindow: {
      title: "command_gesture_reload_all_config_current_window_title",
      description:
        "command_gesture_reload_all_config_current_window_description",
      type: ConfigType.Toggle,
      default: false
    }
  }

  execute(): void {
    chrome.tabs.query({currentWindow: this.config.currentWindow.value || undefined}, (tabs) => {
      for (let tab of tabs) {
        chrome.tabs.reload(tab.id).then()
      }
    })
  }
}
