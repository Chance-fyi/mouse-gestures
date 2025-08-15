import type { CommandInterface } from "~commands/command-interface"

export class ToggleLastTab implements CommandInterface {
  readonly uniqueKey: string = "gesture-toggle-last-tab"
  readonly title: string = "command_gesture_toggle_last_tab_title"
  readonly description: string = "command_gesture_toggle_last_tab_description"
  config: { [key: string]: any } = {}

  execute(): void {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      chrome.tabs.update(tabs[tabs.length - 1].id, { active: true }).then()
    })
  }
}
