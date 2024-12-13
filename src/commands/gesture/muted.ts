import type { CommandInterface } from "~commands/command-interface"

export class Muted implements CommandInterface {
  readonly uniqueKey: string = "gesture-muted"
  readonly title: string = "command_gesture_muted_title"
  readonly description: string = "command_gesture_muted_description"
  config: { [key: string]: any } = {}

  execute(): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.update(tabs[0].id, { muted: !tabs[0].mutedInfo.muted }).then()
    })
  }
}
