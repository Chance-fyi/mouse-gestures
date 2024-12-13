import type { CommandInterface } from "~commands/command-interface"

export class CloseOtherTabs implements CommandInterface {
  readonly uniqueKey: string = "gesture-close-other-tabs"
  readonly title: string = "command_gesture_close_other_tabs_title"
  readonly description: string = "command_gesture_close_other_tabs_description"
  config: { [key: string]: any } = {}

  execute(): void {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      chrome.tabs
        .remove(tabs.filter((tab) => !tab.active).map((tab) => tab.id))
        .then()
    })
  }
}
