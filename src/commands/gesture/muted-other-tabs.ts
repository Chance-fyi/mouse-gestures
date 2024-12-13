import type { CommandInterface } from "~commands/command-interface"

export class MutedOtherTabs implements CommandInterface {
  readonly uniqueKey: string = "gesture-muted-other-tabs"
  readonly title: string = "command_gesture_muted_other_tabs_title"
  readonly description: string = "command_gesture_muted_other_tabs_description"
  config: { [key: string]: any } = {}

  execute(): void {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      tabs.forEach((tab) => {
        if (!tab.active) {
          chrome.tabs.update(tab.id, { muted: true }).then()
        }
      })
    })
  }
}
