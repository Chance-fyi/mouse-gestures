import type { CommandInterface } from "~commands/command-interface"

export class CloseRightTabs implements CommandInterface {
  readonly uniqueKey: string = "gesture-close-right-tabs"
  readonly title: string = "command_gesture_close_right_tabs_title"
  readonly description: string = "command_gesture_close_right_tabs_description"
  config: { [key: string]: any } = {}

  execute(): void {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      chrome.tabs
        .remove(
          tabs
            .slice(tabs.findIndex((tab) => tab.active) + 1)
            .map((tab) => tab.id)
        )
        .then()
    })
  }
}
