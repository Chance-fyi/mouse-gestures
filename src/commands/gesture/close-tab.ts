import type { CommandInterface } from "~commands/command-interface"

export class CloseTab implements CommandInterface {
  readonly uniqueKey: string = "gesture-close-tab"
  readonly title: string = "command_gesture_close_tab_title"
  readonly description: string = "command_gesture_close_tab_description"
  config: { [key: string]: any } = {}

  execute(): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.remove(tabs[0].id).then()
    })
  }
}
