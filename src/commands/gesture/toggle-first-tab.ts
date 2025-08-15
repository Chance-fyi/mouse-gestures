import type { CommandInterface } from "~commands/command-interface"

export class ToggleFirstTab implements CommandInterface {
  readonly uniqueKey: string = "gesture-toggle-first-tab"
  readonly title: string = "command_gesture_toggle_first_tab_title"
  readonly description: string = "command_gesture_toggle_first_tab_description"
  config: { [key: string]: any } = {
    includeFixed: {
      title: "command_gesture_toggle_first_tab_include_fixed_title",
      description: "command_gesture_toggle_first_tab_include_fixed_description",
      type: "toggle",
      value: false
    }
  }

  execute(): void {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      for (let tab of tabs) {
        if (tab.pinned === this.config.includeFixed.value) {
          chrome.tabs.update(tab.id, { active: true }).then()
          break
        }
      }
    })
  }
}
