import type { CommandInterface } from "~commands/command-interface"

export class CloseLeftTabs implements CommandInterface {
  readonly uniqueKey: string = "gesture-close-left-tabs"
  readonly title: string = "command_gesture_close_left_tabs_title"
  readonly description: string = "command_gesture_close_left_tabs_description"
  config: { [key: string]: any } = {}

  execute(): void {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      chrome.tabs
        .remove(
          tabs
            .slice(
              0,
              tabs.findIndex((tab) => tab.active)
            )
            .map((tab) => tab.id)
        )
        .then()
    })
  }
}
