import type { CommandInterface } from "~commands/command-interface"

export class Duplicate implements CommandInterface {
  readonly uniqueKey: string = "gesture-duplicate"
  readonly title: string = "command_gesture_duplicate_title"
  readonly description: string = "command_gesture_duplicate_description"
  config: { [key: string]: any } = {}

  execute(): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.duplicate(tabs[0].id).then()
    })
  }
}
